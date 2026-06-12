import React, { useState } from 'react'
import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useFarmer } from '../../context/DashboardContext'
import { useAuth } from '../../context/AuthContext'
import useProtectedRoute from '../../hooks/useAuth'
import './FarmerLayout.css'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const navItems = [
  { to: 'overview',  icon: 'bi-grid',            label: 'Dashboard'   },
  { to: 'forecast',  icon: 'bi-cloud-sun',        label: 'Forecast'    },
  { to: 'crops',     icon: 'bi-journal-richtext',  label: 'Crop Guide'  },
  { to: 'saved',     icon: 'bi-calendar-check',   label: 'Saved Dates' },
  { to: 'settings',  icon: 'bi-gear',             label: 'Settings'    },
]

const FarmerLayout = () => {
  useProtectedRoute('farmer')
  const { farmerName, location } = useFarmer()
  const { logout, user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [sidebarOpen])
  const navigate = useNavigate()

  const handleLogout = () => logout()

  const Sidebar = ({ onNav }) => (
    <>
      <div className="d-flex align-items-center gap-2 mb-5 px-2">
        <span className="farmer-sidebar-logo-icon"><i className="bi bi-cloud-sun-fill text-success fs-5"></i></span>
        <span className="farmer-sidebar-logo-text">SmartAgriClimate</span>
      </div>
      <nav className="flex-grow-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNav}
            className={({ isActive }) => 
              `farmer-nav-item ${isActive ? 'farmer-nav-item-active' : 'farmer-nav-item-inactive'}`
            }
          >
            <i className={`bi ${item.icon} fs-5`}></i>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="farmer-sidebar-footer">
        <button onClick={handleLogout} className="farmer-logout-sidebar-btn">
          <i className="bi bi-box-arrow-right"></i> Logout
        </button>
        <p className="farmer-version-text">SmartAgriClimate v1.0</p>
      </div>
    </>
  )

  return (
    <div className="farmer-layout-wrapper">
      {/* Desktop sidebar */}
      <div className="d-none d-lg-flex farmer-sidebar-base farmer-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && <div className="farmer-sidebar-mobile-overlay" onClick={() => setSidebarOpen(false)} />}
      <div 
        className="d-lg-none farmer-sidebar-base farmer-sidebar-mobile"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <Sidebar onNav={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="farmer-main-content flex-grow-1">
        <div className="farmer-topbar">
          <div className="d-flex align-items-center gap-3 min-vw-0">
            <button className="d-lg-none farmer-menu-toggle p-1" onClick={() => setSidebarOpen(true)}>
              <i className="bi bi-list"></i>
            </button>
            <div>
              <h6 className="farmer-greeting-title">
                {getGreeting()}, {farmerName.split(' ')[0]} 👋
              </h6>
              <p className="farmer-topbar-location">
                <i className="bi bi-geo-alt me-1"></i>{location}
              </p>
            </div>
          </div>

          <Link to="/dashboard/settings" className="text-decoration-none">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={farmerName} className="farmer-topbar-avatar" />
            ) : (
              <div className="farmer-topbar-placeholder">
                {farmerName?.[0] || 'F'}
              </div>
            )}
          </Link>
        </div>

        <div className="farmer-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default FarmerLayout