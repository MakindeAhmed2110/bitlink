import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './MobileMenu.css'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Overlay */}
      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/logo.png" alt="Bitlink" className="menu-logo" />
          <span className="menu-title">BITLINK</span>
        </div>

        <nav className="mobile-menu-nav">
          <Link
            to="/dashboard"
            className={`mobile-menu-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" strokeWidth={2} />
              <rect x="14" y="3" width="7" height="7" strokeWidth={2} />
              <rect x="14" y="14" width="7" height="7" strokeWidth={2} />
              <rect x="3" y="14" width="7" height="7" strokeWidth={2} />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/dashboard/transactions"
            className={`mobile-menu-link ${isActive('/dashboard/transactions') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>Transactions</span>
          </Link>

          <Link
            to="/dashboard/position"
            className={`mobile-menu-link ${isActive('/dashboard/position') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Manage Position</span>
          </Link>

          <div className="mobile-menu-divider"></div>

          <Link to="/" className="mobile-menu-link" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Home</span>
          </Link>
        </nav>

        <div className="mobile-menu-footer">
          <p>Banking Without a Bank</p>
          <span>Powered by Mezo</span>
        </div>
      </div>
    </>
  )
}

