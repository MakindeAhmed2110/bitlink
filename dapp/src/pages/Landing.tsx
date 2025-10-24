import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useNavigate } from 'react-router-dom'
import MobileMenu from '../components/MobileMenu'
import './Landing.css'

export default function Landing() {
  const { isConnected } = useAccount()
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <div className="logo">
            <img src="/logo.png" alt="Bitlink" />
            <span className="logo-text">BITLINK</span>
          </div>
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#card">Card</a>
            <a href="#services">Services</a>
            <a href="#merchants">Merchants</a>
          </div>
          <div className="nav-actions">
            <MobileMenu />
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              BANKING WITHOUT
              <br />
              A BANK
            </h1>
            <p className="hero-subtitle">
              Digital Banking for the Modern World!
              <br />
              150+ merchants and ATMs globally.
            </p>
            <div className="hero-actions">
              {isConnected ? (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard →
                </button>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button className="btn btn-primary" onClick={openConnectModal}>
                      Join now →
                    </button>
                  )}
                </ConnectButton.Custom>
              )}
              <button className="btn btn-secondary">Know more</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="phone-mockup">
              <div className="phone-screen">
                <img src="/logo.png" alt="Bitlink" className="phone-logo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <section className="card-section">
        <div className="card-content">
          <div className="card-info">
            <h2 className="section-title">BITLINK CARD</h2>
            <p className="section-description">
              The most exclusive banking card, designed for global citizens.
            </p>
            <ul className="features-list">
              <li>
                <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No foreign transaction fees</span>
              </li>
              <li>
                <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Instant virtual card issuance</span>
              </li>
              <li>
                <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>1% cashback on all purchases</span>
              </li>
              <li>
                <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Contactless payments worldwide</span>
              </li>
            </ul>
            <button className="btn btn-primary">Get your card</button>
          </div>
          <div className="card-visual">
            <img src="/virtualcard.png" alt="Bitlink Virtual Card" className="virtual-card" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title centered">FEATURES DESIGNED FOR YOU</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
                <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
              </svg>
            </div>
            <h3>Virtual Card</h3>
            <p>Shop online safely with a card you control.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
              </svg>
            </div>
            <h3>Mobile App</h3>
            <p>All your finances in your pocket, always.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3>Secure</h3>
            <p>Your data and money are always protected.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M2 12h20" strokeWidth="2" />
                <path
                  d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3>Global Access</h3>
            <p>Use Bitlink wherever you are, no borders.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

