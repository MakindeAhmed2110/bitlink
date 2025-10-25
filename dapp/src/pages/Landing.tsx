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
            <div className="logo-container">
              <img src="/logo.png" alt="Bitlink" className="rotating-logo" />
            </div>
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
              BANKING WITHOUT A BANK
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
              <a 
                href="https://meso.money" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                Know more
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="earth-container">
              <div className="earth-sphere">
                <div className="earth-surface">
                  <div className="earth-continents">
                    <div className="continent"></div>
                    <div className="continent"></div>
                    <div className="continent"></div>
                    <div className="continent"></div>
                  </div>
                </div>
                <div className="earth-atmosphere"></div>
              </div>
              <div className="floating-elements">
                <div className="floating-card card-1">
                  <div className="card-content">
                    <div className="card-icon">💳</div>
                    <span>Virtual Card</span>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-content">
                    <div className="card-icon">🌍</div>
                    <span>Global Access</span>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-content">
                    <div className="card-icon">🔒</div>
                    <span>Secure</span>
                  </div>
                </div>
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
              <div className="icon-background">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
                  <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
                  <circle cx="12" cy="8" r="1" fill="currentColor" />
                </svg>
              </div>
            </div>
            <h3>Virtual Card</h3>
            <p>Shop online safely with a card you control.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-background">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
                  <circle cx="12" cy="6" r="1" fill="currentColor" />
                </svg>
              </div>
            </div>
            <h3>Mobile App</h3>
            <p>All your finances in your pocket, always.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-background">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    strokeWidth="2"
                  />
                  <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h3>Secure</h3>
            <p>Your data and money are always protected.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <div className="icon-background">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M2 12h20" strokeWidth="2" />
                  <path
                    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                    strokeWidth="2"
                  />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>
            <h3>Global Access</h3>
            <p>Use Bitlink wherever you are, no borders.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-content">
          <h2 className="section-title centered">FREQUENTLY ASKED QUESTIONS</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>What is Bitlink?</h3>
              <p>Bitlink is a decentralized banking platform that allows you to manage your finances without traditional banks. You can borrow MUSD against your Bitcoin collateral, use virtual cards, and access global financial services.</p>
            </div>
            <div className="faq-item">
              <h3>How do I get MUSD?</h3>
              <p>You can get MUSD by depositing Bitcoin as collateral and borrowing against it. The platform uses a collateralized debt position (CDP) system where you maintain a minimum collateral ratio to keep your position safe.</p>
            </div>
            <div className="faq-item">
              <h3>Is my Bitcoin safe?</h3>
              <p>Yes, your Bitcoin is secured by smart contracts on the blockchain. You maintain full control of your keys and can withdraw your collateral at any time by repaying your debt.</p>
            </div>
            <div className="faq-item">
              <h3>What can I do with MUSD?</h3>
              <p>MUSD can be used for payments, transfers, virtual card purchases, and as a stable store of value. It's pegged to the US dollar and maintains its value through algorithmic mechanisms.</p>
            </div>
            <div className="faq-item">
              <h3>How do virtual cards work?</h3>
              <p>Virtual cards are generated instantly and can be used for online purchases worldwide. They're backed by your MUSD balance and provide the same security as traditional banking cards.</p>
            </div>
            <div className="faq-item">
              <h3>What are the fees?</h3>
              <p>Bitlink charges minimal fees for borrowing (stability fee) and transaction costs. There are no foreign transaction fees, monthly fees, or hidden charges like traditional banks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-container">
                <img src="/logo.png" alt="Bitlink" className="rotating-logo" />
              </div>
              <span className="logo-text">BITLINK</span>
            </div>
            <p className="footer-description">
              Banking without a bank. The future of decentralized finance is here.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.324-7.43 2.324-.484 0-.964-.028-1.44-.084 2.666 1.71 5.833 2.707 9.235 2.707 11.08 0 17.12-9.17 17.12-17.12 0-.26-.005-.52-.015-.78 1.175-.85 2.197-1.91 3.005-3.12z"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Product</h3>
            <ul>
              <li><a href="#">Virtual Card</a></li>
              <li><a href="#">Borrow MUSD</a></li>
              <li><a href="#">Analytics</a></li>
              <li><a href="#">API</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Tutorials</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect</h3>
            <ul>
              <li><a href="#">Discord</a></li>
              <li><a href="#">Telegram</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Bitlink. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

