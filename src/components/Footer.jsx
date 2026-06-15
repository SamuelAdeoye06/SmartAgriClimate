import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="as-footer">
      <div className="container">
        <div className="row gy-4">

          {/* Brand */}
          <div className="col-lg-4">
            <Link to="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none">
              <i className="bi bi-cloud-sun-fill text-success fs-4"></i>
              <span className="as-footer-logo-text">
                SmartAgriClimate
              </span>
            </Link>
            <p className="as-footer-desc">
              Smart weather intelligence for modern farmers. Plan smarter, harvest better.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2 offset-lg-2">
            <h6 className="as-footer-heading">Product</h6>
            {['Features', 'How It Works'].map((link) => (
              <div key={link} className="mb-2">
                <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="as-footer-link">
                  {link}
                </a>
              </div>
            ))}
          </div>

          {/* Account */}
          <div className="col-6 col-lg-2">
            <h6 className="as-footer-heading">Account</h6>
            <div className="mb-2">
              <Link to="/login" className="as-footer-link">Login</Link>
            </div>
            <div className="mb-2">
              <Link to="/register" className="as-footer-link">Register</Link>
            </div>
          </div>

        </div>

        <hr className="as-footer-divider" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="as-footer-copy">
            © 2026 SmartAgriClimate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
