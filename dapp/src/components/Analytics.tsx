import { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import { useMUSDBalance } from '../hooks/useMUSDBalance'
import { useWBTCBalance } from '../hooks/useWBTCBalance'
import { useAccount } from 'wagmi'
import './Analytics.css'

interface AnalyticsProps {
  isOpen: boolean
  onClose: () => void
}

export default function Analytics({ isOpen, onClose }: AnalyticsProps) {
  const { address } = useAccount()
  const { transactions, isLoading: isLoadingTx } = useTransactionHistory()
  const { musdBalance, btcBalance } = useMUSDBalance(address)
  const { wbtcBalance } = useWBTCBalance()
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | 'all'>('7d')

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!transactions.length) return []

    const now = Date.now()
    const periodMap = {
      '7d': now - 7 * 24 * 60 * 60 * 1000,
      '30d': now - 30 * 24 * 60 * 60 * 1000,
      'all': 0,
    }
    const cutoffTime = periodMap[selectedPeriod]

    // Filter transactions by period
    const filteredTxs = transactions.filter((tx) => {
      const txDate = new Date(tx.timestamp).getTime()
      return txDate >= cutoffTime
    })

    // Group by day
    const grouped = filteredTxs.reduce((acc, tx) => {
      const date = new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const amount = parseFloat(tx.amount)
      
      if (!acc[date]) {
        acc[date] = {
          date,
          MUSD: 0,
          BTC: 0,
          send: 0,
          receive: 0,
          borrow: 0,
          count: 0,
        }
      }
      
      if (tx.currency === 'MUSD') {
        if (amount > 0) {
          acc[date].receive += amount
        } else {
          acc[date].send += Math.abs(amount)
        }
        acc[date].MUSD += Math.abs(amount)
        acc[date].count += 1
      } else if (tx.currency === 'BTC') {
        acc[date].BTC += Math.abs(amount)
        acc[date].count += 1
      }
      
      return acc
    }, {} as Record<string, any>)

    return Object.values(grouped).slice(-7) // Last 7 days for readability
  }, [transactions, selectedPeriod])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!transactions.length) {
      return {
        totalMUSD: 0,
        totalBTC: 0,
        sendCount: 0,
        receiveCount: 0,
        borrowCount: 0,
        avgAmount: 0,
      }
    }

    const periodMap = {
      '7d': Date.now() - 7 * 24 * 60 * 60 * 1000,
      '30d': Date.now() - 30 * 24 * 60 * 60 * 1000,
      'all': 0,
    }
    const cutoffTime = periodMap[selectedPeriod]
    const filteredTxs = transactions.filter((tx) => {
      const txDate = new Date(tx.timestamp).getTime()
      return txDate >= cutoffTime
    })

    const musdTxs = filteredTxs.filter((tx) => tx.currency === 'MUSD')
    const btcTxs = filteredTxs.filter((tx) => tx.currency === 'BTC')
    
    const totalMUSD = musdTxs.reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0)
    const totalBTC = btcTxs.reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0)
    
    const sendCount = musdTxs.filter((tx) => tx.type === 'send').length
    const receiveCount = musdTxs.filter((tx) => tx.type === 'receive').length
    const borrowCount = musdTxs.filter((tx) => tx.type === 'borrow').length
    
    const avgAmount = musdTxs.length > 0 ? totalMUSD / musdTxs.length : 0

    return {
      totalMUSD,
      totalBTC,
      sendCount,
      receiveCount,
      borrowCount,
      avgAmount,
    }
  }, [transactions, selectedPeriod])

  if (!isOpen) return null

  if (isLoadingTx) {
    return (
      <div className="analytics-modal-overlay" onClick={onClose}>
        <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
          <div className="analytics-loading">
            <div className="loading-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-modal-overlay" onClick={onClose}>
      <div className="analytics-modal" onClick={(e) => e.stopPropagation()}>
      <div className="analytics-header">
        <h2 className="analytics-title">Portfolio Analytics</h2>
        <div className="period-selector">
          <button
            className={`period-btn ${selectedPeriod === '7d' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('7d')}
          >
            7D
          </button>
          <button
            className={`period-btn ${selectedPeriod === '30d' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('30d')}
          >
            30D
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('all')}
          >
            All
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon musd">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <path d="M12 6v12M8 9l4-3 4 3M8 15l4 3 4-3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Total MUSD</p>
            <p className="stat-value">{stats.totalMUSD.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon btc">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Total BTC</p>
            <p className="stat-value">{stats.totalBTC.toFixed(4)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon wbtc">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">WBTC Balance</p>
            <p className="stat-value">{parseFloat(wbtcBalance).toFixed(4)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Sends</p>
            <p className="stat-value">{stats.sendCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon receive">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14m0 0l-7-7m7 7l7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Receives</p>
            <p className="stat-value">{stats.receiveCount}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Transaction Volume</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.6)" />
                <YAxis stroke="rgba(255, 255, 255, 0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="send" stackId="a" fill="#ef4444" name="Sent" />
                <Bar dataKey="receive" stackId="a" fill="#10b981" name="Received" />
                <Bar dataKey="borrow" stackId="a" fill="#3b82f6" name="Borrowed" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <p>No transaction data available for this period</p>
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Daily Activity</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.6)" />
                <YAxis stroke="rgba(255, 255, 255, 0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="MUSD" 
                  stroke="#ffffff" 
                  strokeWidth={2}
                  dot={{ fill: '#ffffff', r: 4 }}
                  name="MUSD Volume"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-empty">
              <p>No transaction data available for this period</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

