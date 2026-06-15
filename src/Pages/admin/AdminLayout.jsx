import { useState } from 'react'
import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'
import { useAdmin } from '../../context/DashboardContext'
import { useAuth } from '../../context/AuthContext'
import useProtectedRoute from '../../hooks/useAuth'
import { emojiFor } from '../../utils/emojiMap'
import './AdminLayout.css'

const AdminSidebar = ({ navItems, onNav, isSuperAdmin, adminName, onAddAdmin, onLogout }) => (
  <>
    <Link to="/" onClick={onNav} className="d-flex align-items-center gap-2 mb-4 px-2 text-decoration-none">
      <i className="bi bi-cloud-sun-fill text-success fs-5"></i>
      <div>
        <div className="sidebar-logo-text">SmartAgriClimate</div>
        <div className="sidebar-logo-sub">Admin Panel</div>
      </div>
    </Link>

    <div className="sidebar-user-pill">
      <div className="user-pill-label">Signed in as</div>
      <div className="user-pill-name">
        {isSuperAdmin ? <><span className="me-1" aria-hidden="true">{emojiFor('admin')}</span>Super Admin</> : 'Admin'}
      </div>
      <div className="user-pill-email">{adminName}</div>
    </div>

    <nav className="flex-grow-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNav}
          className={({ isActive }) =>
            `nav-link-base ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
          }
        >
          <i className={`bi ${item.icon} fs-5`}></i>
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div className="sidebar-footer">
      {isSuperAdmin && (
        <button onClick={onAddAdmin} className="sidebar-btn-add">
          <i className="bi bi-person-plus"></i> Add Admin
        </button>
      )}
      <button onClick={onLogout} className="sidebar-btn-logout">
        <i className="bi bi-box-arrow-right"></i> Logout
      </button>
    </div>
  </>
)

const AdminLayout = () => {
  useProtectedRoute(['admin', 'super_admin'])
  const { isSuperAdmin, adminName } = useAdmin()
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

  const navItems = [
    { to: 'overview',      icon: 'bi-grid',        label: 'Overview'      },
    { to: 'farmers',       icon: 'bi-people',       label: 'Farmers'       },
    ...(isSuperAdmin ? [{ to: 'admins', icon: 'bi-shield-check', label: 'Admins' }] : []),
    { to: 'weather-rules', icon: 'bi-sliders',      label: 'Weather Rules' },
    { to: 'settings',      icon: 'bi-gear',         label: 'Settings'      },
  ]

  const handleAddAdmin = (onNav) => {
    navigate('/admin/register')
    onNav?.()
  }

  return (
    <div className="admin-layout-wrapper">
      {/* Desktop sidebar */}
      <div className="d-none d-lg-flex sidebar-base sidebar-desktop">
        <AdminSidebar
          navItems={navItems}
          isSuperAdmin={isSuperAdmin}
          adminName={adminName}
          onAddAdmin={() => handleAddAdmin()}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && <div className="sidebar-mobile-overlay" onClick={() => setSidebarOpen(false)} />}
      <div 
        className="d-lg-none sidebar-base sidebar-mobile"
        style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <AdminSidebar
          navItems={navItems}
          onNav={() => setSidebarOpen(false)}
          isSuperAdmin={isSuperAdmin}
          adminName={adminName}
          onAddAdmin={() => handleAddAdmin(() => setSidebarOpen(false))}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="admin-main-content flex-grow-1">
        <div className="topbar-wrapper">
          <div className="d-flex align-items-center gap-3 min-vw-0">
            <button className="d-lg-none mobile-menu-toggle p-1" onClick={() => setSidebarOpen(true)}>
              <i className="bi bi-list"></i>
            </button>
            <div>
              <h6 className="topbar-title">Admin Control Panel</h6>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <p className="topbar-subtitle">SmartAgriClimate · {adminName}</p>
                <span className={`topbar-role-badge ${isSuperAdmin ? 'topbar-role-badge-super' : ''}`}>
                  {isSuperAdmin ? <><span className="me-1" aria-hidden="true">{emojiFor('admin')}</span>Super Admin</> : 'Admin'}
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            {isSuperAdmin && (
              <button onClick={() => navigate('/admin/register')} className="btn btn-sm d-none d-md-flex align-items-center gap-2 px-3 topbar-add-btn">
                <i className="bi bi-person-plus"></i> Add Admin
              </button>
            )}
            <Link to="/admin/settings">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={adminName} className="topbar-avatar" />
              ) : (
                <div className="topbar-avatar-placeholder">
                  {adminName?.[0] || 'A'}
                </div>
              )}
            </Link>
          </div>
        </div>

        <div className="main-content-padding">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
