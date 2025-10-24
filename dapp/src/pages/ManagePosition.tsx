import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useTroveData } from '../hooks/useTroveData'
import { useMUSDBalance } from '../hooks/useMUSDBalance'
import MobileMenu from '../components/MobileMenu'
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import './ManagePosition.css'

export default function ManagePosition() {
  const { isConnected, address } = useAccount()
  const { hasTrove, debt, collateral, collateralRatio, healthFactor, btcPrice, liquidationPrice } = useTroveData(address)
  const { musdBalance, btcBalance } = useMUSDBalance(address)

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

  if (!hasTrove) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <div className="nav-content">
            <div className="logo">
              <img src="/logo.png" alt="Bitlink" />
              <span className="logo-text">BITLINK</span>
            </div>
            <div className="nav-menu">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/dashboard/transactions" className="nav-link">Transactions</Link>
              <Link to="/dashboard/position" className="nav-link active">Manage Position</Link>
            </div>
            <div className="nav-actions">
              <ConnectButton />
            </div>
          </div>
        </nav>
        <div className="not-connected">
          <h2>No Active Position</h2>
          <p>You haven't borrowed any MUSD yet. Open a position to get started!</p>
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    )
  }

  // Mock historical data for charts
  const debtHistory = [
    { time: '1d ago', value: parseFloat(debt) * 0.95 },
    { time: '18h ago', value: parseFloat(debt) * 0.97 },
    { time: '12h ago', value: parseFloat(debt) * 0.98 },
    { time: '6h ago', value: parseFloat(debt) * 0.99 },
    { time: 'Now', value: parseFloat(debt) },
  ]

  const collateralHistory = [
    { time: '1d ago', value: parseFloat(collateral) },
    { time: '18h ago', value: parseFloat(collateral) },
    { time: '12h ago', value: parseFloat(collateral) },
    { time: '6h ago', value: parseFloat(collateral) },
    { time: 'Now', value: parseFloat(collateral) },
  ]

  const healthHistory = [
    { time: '1d ago', health: healthFactor * 0.95 },
    { time: '18h ago', health: healthFactor * 0.97 },
    { time: '12h ago', health: healthFactor * 0.99 },
    { time: '6h ago', health: healthFactor },
    { time: 'Now', health: healthFactor },
  ]

  // Pie chart data for collateral composition
  const pieData = [
    { name: 'Locked', value: parseFloat(collateral), color: '#f7931a' },
    { name: 'Available', value: parseFloat(btcBalance), color: '#4ade80' },
  ]

  const getHealthStatus = () => {
    if (healthFactor >= 80) return { text: 'Excellent', color: '#4ade80' }
    if (healthFactor >= 60) return { text: 'Good', color: '#22c55e' }
    if (healthFactor >= 40) return { text: 'Fair', color: '#fbbf24' }
    if (healthFactor >= 20) return { text: 'At Risk', color: '#f59e0b' }
    return { text: 'Critical', color: '#ef4444' }
  }

  const healthStatus = getHealthStatus()

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="logo">
            <img src="/logo.png" alt="Bitlink" />
            <span className="logo-text">BITLINK</span>
          </div>
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/dashboard/transactions" className="nav-link">Transactions</Link>
            <Link to="/dashboard/position" className="nav-link active">Manage Position</Link>
          </div>
          <div className="nav-actions">
            <MobileMenu />
            <ConnectButton />
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Manage Position</h1>

          {/* Key Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon collateral-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z" />
                  </svg>
                </div>
                <h3>BTC Collateral</h3>
              </div>
              <div className="metric-value">{parseFloat(collateral).toFixed(4)} BTC</div>
              <div className="metric-sub">≈ ${(parseFloat(collateral) * btcPrice).toLocaleString()}</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon debt-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <path d="M12 6v12M8 9l4-3 4 3M8 15l4 3 4-3" strokeWidth={2} />
                  </svg>
                </div>
                <h3>Borrowed MUSD</h3>
              </div>
              <div className="metric-value">{parseFloat(debt).toFixed(2)} MUSD</div>
              <div className="metric-sub">≈ ${parseFloat(debt).toFixed(2)}</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon ratio-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 3v18h18" strokeWidth={2} />
                    <path d="M7 15l4-8 5 4 5-8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Collateral Ratio</h3>
              </div>
              <div className="metric-value">{collateralRatio.toFixed(2)}%</div>
              <div className="metric-sub">Min: 110% • Safe: 150%+</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <div className="metric-icon health-icon" style={{ color: healthStatus.color }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth={2} />
                  </svg>
                </div>
                <h3>Health Factor</h3>
              </div>
              <div className="metric-value" style={{ color: healthStatus.color }}>
                {healthStatus.text}
              </div>
              <div className="metric-sub">
                <div className="health-bar-mini">
                  <div className="health-fill-mini" style={{ width: `${healthFactor}%`, backgroundColor: healthStatus.color }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-card large">
              <h3>Health Factor Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={healthHistory}>
                  <defs>
                    <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={healthStatus.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={healthStatus.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="health"
                    stroke={healthStatus.color}
                    strokeWidth={3}
                    fill="url(#healthGradient)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Collateral Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pie-legend">
                {pieData.map((item) => (
                  <div key={item.name} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                    <span>{item.name}: {item.value.toFixed(4)} BTC</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="stats-section">
            <div className="stat-row">
              <div className="stat-item">
                <span className="stat-label">Current BTC Price</span>
                <span className="stat-value">${btcPrice.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Liquidation Price</span>
                <span className="stat-value warning">${liquidationPrice.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Interest Rate</span>
                <span className="stat-value">1.00% APY</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Available MUSD</span>
                <span className="stat-value">{parseFloat(musdBalance).toFixed(2)} MUSD</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="position-actions">
            <button className="action-btn primary-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Collateral
            </button>
            <button className="action-btn secondary-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
              Withdraw Collateral
            </button>
            <button className="action-btn secondary-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Borrow More
            </button>
            <button className="action-btn secondary-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Repay MUSD
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

