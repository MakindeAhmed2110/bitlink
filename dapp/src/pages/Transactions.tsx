import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import MobileMenu from '../components/MobileMenu'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import type { Transaction } from '../hooks/useTransactionHistory'
import './Transactions.css'

const getTransactionIcon = (type: Transaction['type']) => {
  switch (type) {
    case 'send':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      )
    case 'receive':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4"
          />
        </svg>
      )
    case 'deposit':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m0 0l-4-4m4 4l4-4"
          />
        </svg>
      )
    case 'borrow':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      )
    case 'repay':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )
    case 'withdraw':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      )
  }
}

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'confirmed':
      return 'status-confirmed'
    case 'pending':
      return 'status-pending'
    case 'failed':
      return 'status-failed'
    default:
      return ''
  }
}

export default function Transactions() {
  const { isConnected } = useAccount()
  const { transactions, isLoading } = useTransactionHistory()
  const [filter, setFilter] = useState<string>('all')

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true
    return tx.type === filter
  })

  if (!isConnected) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <div className="nav-content">
            <div className="logo">
              <img src="/logo.png" alt="Bitlink" />
              <span className="logo-text">BITLINK</span>
            </div>
          </div>
        </nav>
        <div className="not-connected">
          <h2>Please connect your wallet</h2>
          <ConnectButton />
        </div>
      </div>
    )
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
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/dashboard/transactions" className="nav-link active">
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

      {/* Transactions Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="transactions-header">
            <h1 className="dashboard-title">Transaction History</h1>
            <div className="transactions-filters">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'send' ? 'active' : ''}`}
                onClick={() => setFilter('send')}
              >
                Send
              </button>
              <button 
                className={`filter-btn ${filter === 'receive' ? 'active' : ''}`}
                onClick={() => setFilter('receive')}
              >
                Receive
              </button>
              <button 
                className={`filter-btn ${filter === 'borrow' ? 'active' : ''}`}
                onClick={() => setFilter('borrow')}
              >
                Borrow
              </button>
            </div>
          </div>

          <div className="transactions-container">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                Loading transactions...
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                No transactions found
              </div>
            ) : (
              <div className="transactions-list">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="transaction-item">
                    <div className="transaction-icon">{getTransactionIcon(tx.type)}</div>
                    <div className="transaction-details">
                      <div className="transaction-type">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                      {tx.address && (
                        <div className="transaction-address">
                          {tx.address.startsWith('0x') 
                            ? `${tx.address.slice(0, 6)}...${tx.address.slice(-4)}`
                            : tx.address
                          }
                        </div>
                      )}
                      <div className="transaction-timestamp">{tx.timestamp}</div>
                    </div>
                    <div className="transaction-right">
                      <div className={`transaction-amount ${tx.amount.startsWith('+') ? 'positive' : 'negative'}`}>
                        {tx.amount} {tx.currency}
                      </div>
                      <div className={`transaction-status ${getStatusColor(tx.status)}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </div>
                      <a 
                        href={`https://explorer.test.mezo.org/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          fontSize: '0.75rem', 
                          color: '#60A5FA',
                          textDecoration: 'none',
                          marginTop: '0.25rem'
                        }}
                      >
                        View on Explorer →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

