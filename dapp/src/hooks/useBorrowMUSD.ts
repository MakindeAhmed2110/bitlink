import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACTS } from '../config/web3'

// BorrowerOperations ABI
const BORROWER_OPERATIONS_ABI = [
  {
    inputs: [
      { name: '_debtAmount', type: 'uint256' },
      { name: '_upperHint', type: 'address' },
      { name: '_lowerHint', type: 'address' },
    ],
    name: 'openTrove',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

export function useBorrowMUSD() {
  const [status, setStatus] = useState<'idle' | 'preparing' | 'pending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { writeContract, data: hash, error: writeError } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const borrowMUSD = async (btcAmount: string, musdAmount: string) => {
    try {
      setStatus('preparing')
      setErrorMessage('')

      // For now, we use zero addresses as hints
      // In production, you'd calculate proper hints using HintHelpers
      const upperHint = '0x0000000000000000000000000000000000000000'
      const lowerHint = '0x0000000000000000000000000000000000000000'

      // Convert MUSD amount to wei (18 decimals)
      const debtAmount = parseEther(musdAmount)
      
      // Convert BTC amount to wei (18 decimals)
      const collateralAmount = parseEther(btcAmount)

      setStatus('pending')

      // Call openTrove function
      writeContract({
        address: CONTRACTS.BorrowerOperations as `0x${string}`,
        abi: BORROWER_OPERATIONS_ABI,
        functionName: 'openTrove',
        args: [debtAmount, upperHint, lowerHint],
        value: collateralAmount, // Send BTC as value
      })

    } catch (error: any) {
      setStatus('error')
      setErrorMessage(error?.message || 'Failed to borrow MUSD')
      console.error('Borrow error:', error)
    }
  }

  // Update status based on transaction state
  if (isConfirming && status !== 'pending') {
    setStatus('pending')
  }

  if (isConfirmed && status !== 'success') {
    setStatus('success')
  }

  if (writeError && status !== 'error') {
    setStatus('error')
    setErrorMessage(writeError.message)
  }

  return {
    borrowMUSD,
    status,
    isLoading: status === 'preparing' || status === 'pending' || isConfirming,
    isSuccess: isConfirmed,
    isError: status === 'error',
    errorMessage,
    txHash: hash,
  }
}

