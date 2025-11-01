import { useState, useEffect } from 'react'
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, getAddress } from 'viem'
import { useNavigate } from 'react-router-dom'
import { useVirtualCard } from '../hooks/useVirtualCard'
import { CONTRACTS } from '../config/web3'
import Confetti from 'react-confetti'
import MobileMenu from '../components/MobileMenu'
import './ProductCheckout.css'

// Sample product data
const MOCK_PRODUCT = {
  id: 1,
  name: 'Nike Sportswear Men\'s T-Shirt',
  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  price: 69.00,
  originalPrice: 139.00,
  discount: 50,
  size: 'XL',
  color: 'Red',
}

const MUSD_ABI = [
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
] as const

export default function ProductCheckout() {
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { cardDetails } = useVirtualCard()
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  })
  
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<'store' | 'delivery'>('delivery')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [city, setCity] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'mastercard' | 'visa' | 'apple' | 'other'>('mastercard')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  // Transaction state
  const [error, setError] = useState('')
  
  // Fetch MUSD balance
  const { data: musdBalance, refetch: refetchBalance } = useBalance({
    address: address,
    token: CONTRACTS.MUSD as `0x${string}`,
    query: {
      enabled: !!address,
    },
  })
  
  // Write contract for MUSD transfer
  const { 
    data: hash, 
    writeContract, 
    isPending: isWriting,
    error: writeError 
  } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  
  const isLoading = isWriting || isConfirming
  const totalPrice = MOCK_PRODUCT.price
  
  // Set window size for confetti
  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
  }, [])
  
  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      navigate('/')
    }
  }, [isConnected, navigate])
  
  // Initialize form with card details
  useEffect(() => {
    if (cardDetails) {
      setFirstName('Eduard')
      setLastName('Franz')
      setPhone('+380 555-0115')
      setEmail('user@bitlink.com')
      setCity('New Jersey')
      setDeliveryAddress(cardDetails.billingAddress)
      setZipCode(cardDetails.zipCode)
      
      // Set delivery date to 3 days from now
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 3)
      setDeliveryDate(futureDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }))
      setDeliveryTime('1 pm - 6 pm')
    }
  }, [cardDetails])
  
  // Handle successful payment
  useEffect(() => {
    if (isConfirmed && showConfetti) {
      const timer = setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isConfirmed, showConfetti, navigate])
  
  // Handle payment
  const handleCheckout = async () => {
    setError('')
    
    // Validation
    if (!firstName || !lastName || !phone || !email) {
      setError('Please fill in all contact information')
      return
    }
    
    if (deliveryMethod === 'delivery' && (!deliveryDate || !deliveryTime || !city || !deliveryAddress || !zipCode)) {
      setError('Please fill in all delivery details')
      return
    }
    
    if (!acceptedTerms) {
      setError('Please accept the terms of the user agreement')
      return
    }
    
    const balance = musdBalance ? parseFloat(formatEther(musdBalance.value)) : 0
    if (balance < totalPrice) {
      setError(`Insufficient MUSD balance. You have ${balance.toFixed(2)} MUSD but need ${totalPrice.toFixed(2)} MUSD`)
      return
    }
    
    if (!address) {
      setError('Please connect your wallet')
      return
    }
    
    try {
      // Mock merchant address for testnet demonstration
      // Using a valid test wallet address from the test suite
      const merchantAddress = getAddress('0xb4356f508C4415fe93Fbf38E52B5546482f18d6D')
      
      // Transfer MUSD to merchant
      writeContract({
        address: CONTRACTS.MUSD as `0x${string}`,
        abi: MUSD_ABI,
        functionName: 'transfer',
        args: [merchantAddress, parseEther(totalPrice.toString())],
      })
    } catch (err: any) {
      setError(err?.message || 'Payment failed')
      console.error('Checkout error:', err)
    }
  }
  
  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setError(writeError.message || 'Transaction failed')
      console.error('Write error:', writeError)
    }
  }, [writeError])
  
  // Show confetti when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && !showConfetti) {
      setShowConfetti(true)
      refetchBalance()
    }
  }, [isConfirmed, showConfetti, refetchBalance])
  
  if (!isConnected) {
    return null
  }
  
  const availableBalance = musdBalance ? parseFloat(formatEther(musdBalance.value)) : 0
  
  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <div className="checkout-container">
        {/* Mobile Menu */}
        <MobileMenu />
        
        {/* Back Button */}
        <button className="checkout-back-button" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="checkout-layout">
          {/* Left Panel - Checkout Form */}
          <div className="checkout-form-panel">
            <h1 className="checkout-title">Checkout</h1>
            
            {/* Contact Information */}
            <section className="checkout-section">
              <h2 className="section-label">1. Contact Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </section>
            
            {/* Delivery Method */}
            <section className="checkout-section">
              <h2 className="section-label">2. Delivery method</h2>
              <div className="delivery-methods">
                <button
                  type="button"
                  className={`delivery-method-btn ${deliveryMethod === 'store' ? 'active' : ''}`}
                  onClick={() => setDeliveryMethod('store')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Store
                </button>
                <button
                  type="button"
                  className={`delivery-method-btn ${deliveryMethod === 'delivery' ? 'active' : ''}`}
                  onClick={() => setDeliveryMethod('delivery')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  Delivery
                </button>
              </div>
              
              {deliveryMethod === 'delivery' && (
                <>
                  <div className="form-group">
                    <label>Delivery Date</label>
                    <input
                      type="text"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Convenient Time</label>
                    <input
                      type="text"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}
            </section>
            
            {/* Payment Method */}
            <section className="checkout-section">
              <h2 className="section-label">3. Payment method</h2>
              <div className="payment-methods">
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'mastercard' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('mastercard')}
                >
                  <div className="mastercard-logo">
                    <div className="circle red"></div>
                    <div className="circle orange"></div>
                  </div>
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'visa' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('visa')}
                >
                  <span className="visa-logo">VISA</span>
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'apple' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('apple')}
                >
                  <span className="apple-pay-logo">Apple Pay</span>
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${paymentMethod === 'other' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('other')}
                >
                  OTHER
                </button>
              </div>
            </section>
            
            {/* Card Details Section */}
            <section className="checkout-section">
              <h2 className="section-label">4. Card Details</h2>
              <div className="card-details-form">
                <div className="form-group">
                  <label>Card Name</label>
                  <input
                    type="text"
                    value={cardDetails?.cardName || ''}
                    className="form-input"
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardDetails?.cardNumber || ''}
                    className="form-input"
                    readOnly
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      value={cardDetails?.cvv || ''}
                      className="form-input"
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails ? `${cardDetails.expiryMonth}/${cardDetails.expiryYear}` : ''}
                      className="form-input"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          {/* Right Panel - Order Summary */}
          <div className="checkout-summary-panel">
            <h2 className="summary-title">Order</h2>
            
            {/* Product Details */}
            <div className="product-summary">
              <div className="product-image-wrapper">
                <img src={MOCK_PRODUCT.image} alt={MOCK_PRODUCT.name} className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-name">{MOCK_PRODUCT.name}</h3>
                <div className="product-specs">
                  <div className="spec-item">
                    <label>Size:</label>
                    <select className="spec-select">
                      <option>{MOCK_PRODUCT.size}</option>
                    </select>
                  </div>
                  <div className="spec-item">
                    <label>Color:</label>
                    <span>{MOCK_PRODUCT.color}</span>
                  </div>
                </div>
                <div className="product-price">
                  <span className="original-price">${MOCK_PRODUCT.originalPrice}</span>
                  <span className="current-price">${MOCK_PRODUCT.price}</span>
                </div>
              </div>
            </div>
            
            {/* Price Breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>${MOCK_PRODUCT.originalPrice}</span>
              </div>
              <div className="price-row discount">
                <span>Discount ({MOCK_PRODUCT.discount}% OFF)</span>
                <span>-${(MOCK_PRODUCT.originalPrice - MOCK_PRODUCT.price).toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            
            {/* Total */}
            <div className="total-section">
              <div className="total-row">
                <span>Total</span>
                <span className="total-amount">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="balance-info">
                <span>Available MUSD: {availableBalance.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="checkout-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {isConfirmed && (
              <div className="checkout-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Payment successful! Redirecting...
              </div>
            )}
            
            {/* Checkout Button */}
            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={isLoading || !acceptedTerms}
            >
              {isLoading ? 'Processing...' : 'Checkout'}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            {/* Terms Checkbox */}
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>by confirming the order, I accept the <a href="#" className="terms-link">terms of the user agreement</a></span>
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

