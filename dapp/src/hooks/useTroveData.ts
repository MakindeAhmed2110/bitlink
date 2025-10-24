import { useReadContract } from 'wagmi'
import { CONTRACTS } from '../config/web3'
import { formatUnits } from 'viem'

// TroveManager ABI
const TROVE_MANAGER_ABI = [
  {
    inputs: [{ name: '_borrower', type: 'address' }],
    name: 'getTroveStatus',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_borrower', type: 'address' }],
    name: 'getTroveDebt',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_borrower', type: 'address' }],
    name: 'getTroveColl',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_borrower', type: 'address' }, { name: '_price', type: 'uint256' }],
    name: 'getCurrentICR',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_borrower', type: 'address' }],
    name: 'getEntireDebtAndColl',
    outputs: [
      { name: 'coll', type: 'uint256' },
      { name: 'debt', type: 'uint256' },
      { name: 'pendingCollateralReward', type: 'uint256' },
      { name: 'pendingMUSDDebtReward', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// PriceFeed ABI
const PRICE_FEED_ABI = [
  {
    inputs: [],
    name: 'fetchPrice',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function useTroveData(address: `0x${string}` | undefined) {
  // Get BTC price
  const { data: btcPrice } = useReadContract({
    address: CONTRACTS.PriceFeed as `0x${string}`,
    abi: PRICE_FEED_ABI,
    functionName: 'fetchPrice',
    query: {
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  })

  // Get trove status
  const { data: troveStatus } = useReadContract({
    address: CONTRACTS.TroveManager as `0x${string}`,
    abi: TROVE_MANAGER_ABI,
    functionName: 'getTroveStatus',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  })

  // Get entire debt and collateral
  const { data: troveData, refetch } = useReadContract({
    address: CONTRACTS.TroveManager as `0x${string}`,
    abi: TROVE_MANAGER_ABI,
    functionName: 'getEntireDebtAndColl',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && troveStatus === 1n, // Only fetch if trove is active
      refetchInterval: 10000,
    },
  })

  // Get current ICR if we have price
  const { data: currentICR } = useReadContract({
    address: CONTRACTS.TroveManager as `0x${string}`,
    abi: TROVE_MANAGER_ABI,
    functionName: 'getCurrentICR',
    args: address && btcPrice ? [address, btcPrice] : undefined,
    query: {
      enabled: !!address && !!btcPrice && troveStatus === 1n,
      refetchInterval: 10000,
    },
  })

  const hasTrove = troveStatus === 1n
  const collateral = troveData ? formatUnits(troveData[0], 18) : '0'
  const debt = troveData ? formatUnits(troveData[1], 18) : '0'
  const pendingColl = troveData ? formatUnits(troveData[2], 18) : '0'
  const pendingDebt = troveData ? formatUnits(troveData[3], 18) : '0'
  
  // Calculate collateral ratio (ICR)
  const collateralRatio = currentICR ? Number(formatUnits(currentICR, 16)) : 0
  
  // Calculate health factor (how far from liquidation)
  // Health factor = (CR - 110) / 40 * 100
  // 110% = Critical, 150% = Safe, 200%+ = Very Safe
  const healthFactor = collateralRatio > 0 ? Math.min(100, ((collateralRatio - 110) / 40) * 100) : 0
  
  // Calculate liquidation price
  const btcPriceNum = btcPrice ? Number(formatUnits(btcPrice, 18)) : 100000
  const liquidationPrice = collateralRatio > 0 ? (btcPriceNum * 110) / collateralRatio : 0

  return {
    hasTrove,
    debt,
    collateral,
    pendingDebt,
    pendingColl,
    collateralRatio,
    healthFactor,
    btcPrice: btcPriceNum,
    liquidationPrice,
    refetch,
  }
}

