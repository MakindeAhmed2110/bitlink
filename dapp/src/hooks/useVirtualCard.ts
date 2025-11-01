import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { generateCardDetails, CardDetails } from '../utils/cardGenerator'

/**
 * Hook to manage virtual card details for the connected wallet
 */
export function useVirtualCard() {
  const { address } = useAccount()
  const [cardName, setCardName] = useState<string>('')
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null)

  // Load saved card name from localStorage
  useEffect(() => {
    if (address) {
      const savedName = localStorage.getItem(`cardName_${address}`)
      if (savedName) {
        setCardName(savedName)
      } else {
        // Default name
        setCardName('Bitlink Card')
      }
    }
  }, [address])

  // Generate card details when address or cardName changes
  useEffect(() => {
    if (address) {
      const details = generateCardDetails(address, cardName)
      setCardDetails(details)
    } else {
      setCardDetails(null)
    }
  }, [address, cardName])

  // Save card name to localStorage
  const updateCardName = (newName: string) => {
    if (address) {
      setCardName(newName)
      localStorage.setItem(`cardName_${address}`, newName)
    }
  }

  return {
    cardDetails,
    cardName,
    updateCardName,
    isLoading: !cardDetails && !!address,
  }
}

