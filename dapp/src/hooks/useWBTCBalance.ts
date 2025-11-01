import { useReadContract } from 'wagmi'
import { useAccount } from 'wagmi'
import { formatUnits } from 'viem'
import { CONTRACTS } from '../config/web3'

// ERC20 ABI for balanceOf
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export function useWBTCBalance() {
  const { address } = useAccount()
  
  // Get WBTC balance
  const { data: wbtcBalance, isLoading, refetch } = useReadContract({
    address: CONTRACTS.WBTC as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.WBTC,
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  })

  const formattedWBTC = wbtcBalance ? formatUnits(wbtcBalance, 18) : '0.00'

  return {
    wbtcBalance: formattedWBTC,
    isLoading,
    refetch,
  }
}

