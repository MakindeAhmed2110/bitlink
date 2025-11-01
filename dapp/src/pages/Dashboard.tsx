import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useNavigate, Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import GetMUSDModal from '../components/GetMUSDModal'
import SendModal from '../components/SendModal'
import SwapModal from '../components/SwapModal'
import VirtualCard from '../components/VirtualCard'
import MobileMenu from '../components/MobileMenu'
import Analytics from '../components/Analytics'
import { useMUSDBalance } from '../hooks/useMUSDBalance'
import './Dashboard.css'

export default function Dashboard() {
  const { isConnected, address } = useAccount()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)

  // Get real balances from blockchain
  const { musdBalance, btcBalance, isLoading, refetch } = useMUSDBalance(address)

  // Refetch balances when modal closes (in case of successful transaction)
  const handleModalClose = () => {
    setIsModalOpen(false)
    refetch() // Refresh balances
  }

  const handleSendModalClose = () => {
    setIsSendModalOpen(false)
    refetch() // Refresh balances
  }

  const handleSwapModalClose = () => {
    setIsSwapModalOpen(false)
    refetch() // Refresh balances
  }

  if (!isConnected) {
    navigate('/')
    return null
  }

  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="logo">
            <img src="/logo.png" alt="Bitlink" />
            <span className="logo-text">BITLINK</span>
          </div>
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link active">
              Dashboard
            </Link>
            <Link to="/dashboard/transactions" className="nav-link">
              Transactions
            </Link>
            <Link to="/dashboard/position" className="nav-link">
              Manage Position
            </Link>
          </div>
          <div className="nav-actions">
            <MobileMenu />
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div>
              <h1 className="dashboard-title">Welcome to Bitlink</h1>
              <p className="dashboard-subtitle">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <button className="btn-get-musd" onClick={() => setIsModalOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Get MUSD
            </button>
          </div>

          {/* Balance Cards */}
          <div className="balance-cards">
            <div className="balance-card">
              <div className="balance-card-header">
                <div className="balance-icon btc-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
                  </svg>
                </div>
                <h3>Bitcoin Balance</h3>
              </div>
              <div className="balance-amount">
                {isLoading ? 'Loading...' : `${parseFloat(btcBalance).toFixed(4)} BTC`}
              </div>
              <div className="balance-usd">
                {isLoading ? '...' : `≈ $${(parseFloat(btcBalance) * 100000).toLocaleString()} USD`}
              </div>
            </div>

            <div className="balance-card musd-card">
              <div className="balance-card-header">
                <div className="balance-icon musd-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <path
                      d="M12 6v12M8 9l4-3 4 3M8 15l4 3 4-3"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3>MUSD Balance</h3>
              </div>
              <div className="balance-amount">
                {isLoading ? 'Loading...' : `${parseFloat(musdBalance).toFixed(2)} MUSD`}
              </div>
              <div className="balance-usd">
                {isLoading ? '...' : `≈ $${parseFloat(musdBalance).toFixed(2)} USD`}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-heading">Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-card" onClick={() => setIsSendModalOpen(true)}>
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <h3>Send MUSD</h3>
                <p>Transfer to anyone instantly</p>
              </button>

              <button className="action-card" onClick={() => setIsSwapModalOpen(true)}>
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                </div>
                <h3>Swap</h3>
                <p>Exchange tokens easily</p>
              </button>

              <button className="action-card" onClick={() => setIsAnalyticsOpen(true)}>
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3>Analytics</h3>
                <p>Track your portfolio</p>
              </button>

              <button className="action-card">
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3>Earn</h3>
                <p>Deposit in Stability Pool</p>
              </button>
              
              <button className="action-card" onClick={() => navigate('/product-checkout')}>
                <div className="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3>Try Checkout</h3>
                <p>Pay with your virtual card</p>
              </button>
            </div>
          </div>

          {/* Virtual Card Section */}
          <div className="card-section">
            <h2 className="section-heading">Your Virtual Card</h2>
            <VirtualCard />
          </div>
        </div>
      </main>

      {/* Get MUSD Modal */}
      <GetMUSDModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        availableBTC={btcBalance}
      />

      {/* Send Modal */}
      <SendModal
        isOpen={isSendModalOpen}
        onClose={handleSendModalClose}
      />

      {/* Swap Modal */}
      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={handleSwapModalClose}
      />

      {/* Analytics Modal */}
      <Analytics
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  )
}
