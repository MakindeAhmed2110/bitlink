import { useState, useEffect } from 'react'
import { useVirtualCard } from '../hooks/useVirtualCard'
import './VirtualCard.css'

export default function VirtualCard() {
  const { cardDetails, cardName, updateCardName, isLoading } = useVirtualCard()
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(cardName)
  const [copied, setCopied] = useState(false)

  // Sync editedName when cardName changes
  useEffect(() => {
    if (cardName) {
      setEditedName(cardName)
    }
  }, [cardName])

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateCardName(editedName.trim())
    }
    setIsEditingName(false)
  }

  const handleCopyCardNumber = async () => {
    if (cardDetails) {
      await navigator.clipboard.writeText(cardDetails.cardNumber.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading || !cardDetails) {
    return (
      <div className="virtual-card-container">
        <div className="virtual-card-loading">
          <div className="loading-spinner"></div>
          <p>Loading card details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="virtual-card-container">
      {/* Virtual Card Display */}
      <div className="virtual-card-wrapper">
        <img src="/virtualcard.png" alt="Bitlink Virtual Card" className="virtual-card-image" />
      </div>

      {/* Card Details Section */}
      <div className="card-details-section">
        <div className="card-details-header">
          <h3>Card Details</h3>
          {!isEditingName && (
            <button className="edit-name-btn" onClick={() => setIsEditingName(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Card Name */}
        <div className="card-detail-item">
          <label>Card Name</label>
          {isEditingName ? (
            <div className="edit-name-wrapper">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleSaveName}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                className="edit-name-input"
                autoFocus
              />
              <button className="save-name-btn" onClick={handleSaveName}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              <button className="cancel-name-btn" onClick={() => {
                setEditedName(cardName)
                setIsEditingName(false)
              }}>
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
          ) : (
            <div className="card-value">{cardDetails.cardName}</div>
          )}
        </div>

        {/* Card Number */}
        <div className="card-detail-item">
          <label>Card Number</label>
          <div className="card-value-masked" onClick={handleCopyCardNumber}>
            {cardDetails.cardNumber}
            {copied ? (
              <svg className="copy-icon copied" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg className="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* CVV */}
        <div className="card-detail-item">
          <label>CVV</label>
          <div className="card-value">{cardDetails.cvv}</div>
        </div>

        {/* Expiry Date */}
        <div className="card-detail-item">
          <label>Expiry Date</label>
          <div className="card-value">{cardDetails.expiryMonth}/{cardDetails.expiryYear}</div>
        </div>

        {/* Billing Address - Full Width */}
        <div className="card-detail-item full-width">
          <label>Billing Address</label>
          <div className="card-value">{cardDetails.billingAddress}</div>
        </div>

        {/* Zip Code */}
        <div className="card-detail-item">
          <label>Zip Code</label>
          <div className="card-value">{cardDetails.zipCode}</div>
        </div>

        {/* Info Note */}
        <div className="card-info-note">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path d="M12 16v-4m0 4h.01M12 8h.01" strokeWidth={2} />
          </svg>
          <p>
            This is a testnet virtual card. Use these details on mock payment pages to test transactions.
          </p>
        </div>
      </div>
    </div>
  )
}
