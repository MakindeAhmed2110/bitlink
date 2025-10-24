import { useAccount } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import './Dashboard.css'

export default function Dashboard() {
  const { isConnected, address } = useAccount()
  const navigate = useNavigate()

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
          <div className="nav-actions">
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <h1>Welcome to Bitlink Dashboard</h1>
          <p>Connected: {address}</p>
          <p className="coming-soon">Dashboard features coming soon...</p>
          
          <div className="features-preview">
            <div className="feature-box">
              <h3>💳 Virtual Card</h3>
              <p>Manage your digital card</p>
            </div>
            <div className="feature-box">
              <h3>💰 Send & Receive</h3>
              <p>Transfer MUSD instantly</p>
            </div>
            <div className="feature-box">
              <h3>🏦 Trove Operations</h3>
              <p>Borrow MUSD against BTC</p>
            </div>
            <div className="feature-box">
              <h3>📊 Analytics</h3>
              <p>Track your portfolio</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

