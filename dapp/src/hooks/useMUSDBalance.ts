import { useReadContract, useBalance } from 'wagmi'
import { CONTRACTS } from '../config/web3'
import { formatUnits } from 'viem'

// MUSD Token ABI (ERC20 standard)
const MUSD_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function useMUSDBalance(address: `0x${string}` | undefined) {
  // Get MUSD balance
  const { data: musdBalance, isLoading: isLoadingMUSD, refetch: refetchMUSD } = useReadContract({
    address: CONTRACTS.MUSD as `0x${string}`,
    abi: MUSD_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  })

  // Get BTC balance (native currency)
  const { data: btcBalance, isLoading: isLoadingBTC, refetch: refetchBTC } = useBalance({
    address: address,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
  })

  // Format balances
  const formattedMUSD = musdBalance ? formatUnits(musdBalance, 18) : '0.00'
  const formattedBTC = btcBalance ? formatUnits(btcBalance.value, 18) : '0.00'

  return {
    musdBalance: formattedMUSD,
    btcBalance: formattedBTC,
    btcBalanceRaw: btcBalance,
    isLoading: isLoadingMUSD || isLoadingBTC,
    refetch: () => {
      refetchMUSD()
      refetchBTC()
    },
  }
}

