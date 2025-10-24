import { useState, useEffect } from 'react'
import { useBorrowMUSD } from '../hooks/useBorrowMUSD'
import './GetMUSDModal.css'

interface GetMUSDModalProps {
  isOpen: boolean
  onClose: () => void
  availableBTC?: string
}

export default function GetMUSDModal({ isOpen, onClose, availableBTC = '0.00' }: GetMUSDModalProps) {
  const [btcAmount, setBtcAmount] = useState('')
  const [musdAmount, setMusdAmount] = useState('')
  
  const { borrowMUSD, isLoading, isSuccess, isError, errorMessage, txHash } = useBorrowMUSD()

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setBtcAmount('')
      setMusdAmount('')
    }
  }, [isOpen])

  // Close modal on success after a delay
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }, [isSuccess, onClose])

  if (!isOpen) return null

  const handleBtcChange = (value: string) => {
    setBtcAmount(value)
    // Calculate MUSD at 150% collateral ratio
    // Assuming BTC = $100,000
    const btcValue = parseFloat(value) || 0
    const musdValue = (btcValue * 100000) / 1.5
    setMusdAmount(musdValue.toFixed(2))
  }

  const handleBorrow = async () => {
    if (!btcAmount || !musdAmount || parseFloat(btcAmount) <= 0) {
      return
    }

    await borrowMUSD(btcAmount, musdAmount)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Get MUSD</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Deposit Bitcoin as collateral and borrow MUSD instantly.
            <br />
            Minimum collateral ratio: 150%
          </p>

          <div className="input-group">
            <label>Deposit BTC</label>
            <div className="input-wrapper">
              <input
                type="number"
                placeholder="0.00"
                value={btcAmount}
                onChange={(e) => handleBtcChange(e.target.value)}
                step="0.001"
              />
              <span className="input-suffix">BTC</span>
            </div>
            <span className="input-hint">Available: {parseFloat(availableBTC).toFixed(4)} BTC</span>
          </div>

          <div className="arrow-down">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>

          <div className="input-group">
            <label>Receive MUSD</label>
            <div className="input-wrapper">
              <input
                type="number"
                placeholder="0.00"
                value={musdAmount}
                readOnly
              />
              <span className="input-suffix">MUSD</span>
            </div>
            <span className="input-hint">≈ ${musdAmount} USD</span>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Collateral Ratio</span>
              <span className="stat-value">150%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Interest Rate</span>
              <span className="stat-value">1% APY</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Liquidation Price</span>
              <span className="stat-value">$90,909</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Borrowing Fee</span>
              <span className="stat-value">0.1%</span>
            </div>
          </div>

          <div className="health-indicator">
            <div className="health-bar">
              <div className="health-fill" style={{ width: '85%' }}></div>
            </div>
            <span className="health-label">Health Factor: Safe ✓</span>
          </div>

          {/* Status Messages */}
          {isError && (
            <div className="status-message error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <line x1="15" y1="9" x2="9" y2="15" strokeWidth={2} />
                <line x1="9" y1="9" x2="15" y2="15" strokeWidth={2} />
              </svg>
              <span>{errorMessage || 'Transaction failed. Please try again.'}</span>
            </div>
          )}

          {isSuccess && (
            <div className="status-message success-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <path d="M9 12l2 2 4-4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <span>Trove opened successfully! 🎉</span>
                {txHash && (
                  <a
                    href={`https://explorer.test.mezo.org/tx/${txHash}`}
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

          <button
            className="btn-modal-primary"
            onClick={handleBorrow}
            disabled={!btcAmount || parseFloat(btcAmount) <= 0 || isLoading || isSuccess}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : isSuccess ? (
              'Success! ✓'
            ) : (
              'Borrow MUSD'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

