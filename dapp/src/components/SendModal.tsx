import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useBalance, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import Confetti from 'react-confetti'
import { CONTRACTS } from '../config/web3'
import './SendModal.css'

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SendModal({ isOpen, onClose }: SendModalProps) {
  const { address } = useAccount()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  })

  const { writeContract, data: hash, isPending: isWriting } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })
  
  const isLoading = isWriting || isConfirming

  // Get MUSD balance
  const { data: musdBalance } = useBalance({
    address,
    token: CONTRACTS.MUSD as `0x${string}`,
    query: { enabled: !!address }
  })

  // Set window size for confetti
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setRecipient('')
      setAmount('')
      setError('')
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!recipient || !amount) {
      setError('Please fill in all fields')
      return
    }

    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      setError('Invalid Ethereum address')
      return
    }

    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setError('')

      // Send MUSD token
      writeContract({
        address: CONTRACTS.MUSD as `0x${string}`,
        abi: [
          {
            inputs: [
              { name: '_to', type: 'address' },
              { name: '_value', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: 'transfer',
        args: [recipient as `0x${string}`, parseEther(amount)],
      })
    } catch (err: any) {
      setError(err?.message || 'Transaction failed')
      console.error('Send error:', err)
    }
  }

  // Get available balance
  const availableBalance = musdBalance ? parseFloat(musdBalance.formatted) : 0

  // Close modal on success
  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isConfirmed, onClose])

  if (!isOpen) return null

  return (
    <>
      {isConfirmed && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Send MUSD</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Recipient Input */}
          <div className="input-group">
            <label>Recipient Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={error && !recipient ? 'error' : ''}
            />
          </div>

          {/* Amount Input */}
          <div className="input-group">
            <label>Amount</label>
            <div className="amount-wrapper">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.001"
                className={error && !amount ? 'error' : ''}
              />
              <span className="amount-currency">MUSD</span>
            </div>
            <div className="amount-hint">
              Available: {availableBalance.toFixed(4)} MUSD
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <line x1="15" y1="9" x2="9" y2="15" strokeWidth={2} />
                <line x1="9" y1="9" x2="15" y2="15" strokeWidth={2} />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {isConfirmed && (
            <div className="success-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <path d="M9 12l2 2 4-4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <span>Transaction successful! 🎉</span>
                {hash && (
                  <a
                    href={`https://explorer.test.mezo.org/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    View on Explorer →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Send Button */}
          <button
            className="btn-modal-primary"
            onClick={handleSend}
            disabled={!recipient || !amount || isLoading || isConfirmed}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : isConfirmed ? (
              'Sent! ✓'
            ) : (
              'Send MUSD'
            )}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

