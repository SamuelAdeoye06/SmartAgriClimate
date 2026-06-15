import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NotFound = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const dashboardPath = user
    ? user.role === 'farmer'
      ? '/dashboard/overview'
      : '/admin/overview'
    : null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f7f4 0%, #e8f5e9 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-80px', left: '-80px',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'rgba(45,106,79,0.08)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', right: '-60px',
        width: '250px', height: '250px', borderRadius: '50%',
        background: 'rgba(45,106,79,0.06)', pointerEvents: 'none'
      }} />

      {/* Logo */}
      <Link to="/" style={{
        position: 'absolute', top: '1.5rem', left: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '8px',
        textDecoration: 'none'
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: '#2d6a4f', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#fff'
        }}><i className="bi bi-cloud-sun"></i></div>
        <span style={{ fontWeight: 700, color: '#1b4332', fontSize: '1.1rem' }}>SmartAgriClimate</span>
      </Link>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '480px' }}>

        {/* Illustration */}
        <div style={{ fontSize: '4.5rem', marginBottom: '1rem', lineHeight: 1, color: '#2d6a4f' }}><i className="bi bi-exclamation-triangle-fill"></i></div>

        {/* 404 */}
        <h1 style={{
          fontSize: 'clamp(5rem, 15vw, 8rem)',
          fontWeight: 900,
          color: '#1b4332',
          margin: '0',
          lineHeight: 1,
          letterSpacing: '-4px',
          opacity: 0.15
        }}>404</h1>

        {/* Divider */}
        <div style={{
          width: '60px', height: '4px',
          background: 'linear-gradient(90deg, #2d6a4f, #52b788)',
          borderRadius: '2px', margin: '1.25rem auto'
        }} />

        <h2 style={{
          fontSize: '1.5rem', fontWeight: 700,
          color: '#1b4332', marginBottom: '0.75rem'
        }}>
          This field is empty
        </h2>

        <p style={{
          color: '#6b7280', lineHeight: 1.7,
          marginBottom: '2rem', fontSize: '0.95rem'
        }}>
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back where you belong.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {dashboardPath ? (
            <Link to={dashboardPath} style={{
              background: '#2d6a4f',
              color: 'white', textDecoration: 'none',
              padding: '12px 28px', borderRadius: '50px',
              fontWeight: 600, fontSize: '0.95rem',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 15px rgba(45,106,79,0.3)'
            }}>
              <i className="bi bi-grid"></i> Back to Dashboard
            </Link>
          ) : (
            <Link to="/login" style={{
              background: '#2d6a4f',
              color: 'white', textDecoration: 'none',
              padding: '12px 28px', borderRadius: '50px',
              fontWeight: 600, fontSize: '0.95rem',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 15px rgba(45,106,79,0.3)'
            }}>
              <i className="bi bi-box-arrow-in-right"></i> Sign In
            </Link>
          )}

          <button onClick={() => navigate(-1)} style={{
            background: 'transparent',
            color: '#2d6a4f', border: '2px solid #2d6a4f',
            padding: '12px 28px', borderRadius: '50px',
            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: '8px'
          }}>
            <i className="bi bi-arrow-left"></i> Go Back
          </button>
        </div>
      </div>

      {/* Footer */}
      <p style={{
        position: 'absolute', bottom: '1.5rem',
        color: '#9ca3af', fontSize: '0.8rem', margin: 0
      }}>
        © 2026 SmartAgriClimate. All rights reserved.
      </p>
    </div>
  )
}

export default NotFound
