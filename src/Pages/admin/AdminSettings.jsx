import { useState } from 'react'
import { useAdmin } from '../../context/DashboardContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import ProfileImageModal from '../../components/ProfileImageModal'
import { emojiFor } from '../../utils/emojiMap'
import './AdminSettings.css'

const AdminSettings = () => {
  const { adminName, adminEmail, isSuperAdmin } = useAdmin()
  const { logout, user } = useAuth()

  const [showAvatarModal, setShowAvatarModal] = useState(false)
  // Password change state
  const [showPasswordForm, setShowPasswordForm]   = useState(false)
  const [passwordData, setPasswordData]           = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showCurrent, setShowCurrent]             = useState(false)
  const [showNew, setShowNew]                     = useState(false)
  const [showConfirm, setShowConfirm]             = useState(false)
  const [passwordLoading, setPasswordLoading]     = useState(false)
  const [passwordError, setPasswordError]         = useState(null)
  const [passwordSuccess, setPasswordSuccess]     = useState(false)

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
    setPasswordError(null)
  }

  const handlePasswordSubmit = async () => {
    setPasswordError(null)

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      return setPasswordError('All password fields are required')
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setPasswordError('New passwords do not match')
    }
    if (passwordData.newPassword.length < 8) {
      return setPasswordError('New password must be at least 8 characters')
    }

    try {
      setPasswordLoading(true)
      await api.patch('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      setPasswordSuccess(true)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="settings-container">
      <div className="as-section-header mb-4">
        <div className="as-header-line" />
        <h5 className="as-section-title">Settings</h5>
      </div>

      <div className="as-card profile-header-card p-4 mb-4">
        <div className="profile-header-banner"></div>
        <div className="d-flex flex-column flex-md-row align-items-center gap-4 profile-header-content">
          <div className="position-relative">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={adminName} className="as-avatar profile-avatar-img" />
            ) : (
              <div className="as-avatar-placeholder profile-avatar-placeholder">
                {adminName?.[0] || 'A'}
              </div>
            )}
            <button onClick={() => setShowAvatarModal(true)} className="as-btn avatar-edit-btn" title="Edit Profile Picture">
              <i className="bi bi-camera-fill avatar-edit-icon"></i>
            </button>
          </div>
          <div className="text-center text-md-start">
            <h4 className="as-text-primary profile-name m-0">{adminName}</h4>
            <p className="as-text-soft m-0 mt-1 profile-meta-text">
              <i className="bi bi-shield-lock me-1"></i>{isSuperAdmin ? 'Super Admin' : 'Admin'} · {adminEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="as-card">
            <h6 className="as-text-primary fw-bold mb-3">
              <i className="bi bi-person me-2 as-text-primary"></i>Account Info
            </h6>
            <div className="mb-3">
              <label className="as-label">Full Name</label>
              <div className="as-input border-0 as-bg-light fw-bold">{adminName}</div>
            </div>
            <div className="mb-3">
              <label className="as-label">Email Address</label>
              <div className="as-input border-0 as-bg-light as-text-soft">
                <i className="bi bi-lock me-2"></i>{adminEmail}
              </div>
            </div>
            <div>
              <label className="as-label">Role</label>
              <div className="as-badge as-badge-super px-3 py-2">
                {isSuperAdmin ? <><span className="me-1" aria-hidden="true">{emojiFor('admin')}</span>Super Admin</> : 'Admin'}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="as-card">
            <h6 className="as-text-primary fw-bold mb-3">
              <i className="bi bi-shield me-2 as-text-primary"></i>Account Actions
            </h6>
            <button onClick={logout} className="as-btn as-btn-outline w-100 py-2 justify-content-start logout-action-btn">
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
            <p className="mt-3 as-text-soft settings-meta-info">
              {isSuperAdmin ? "As Super Admin, your account cannot be deleted." : "Your account can only be deleted by a Super Admin."}
            </p>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="as-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="as-text-primary fw-bold m-0">
                <i className="bi bi-key me-2 as-text-primary"></i>Change Password
              </h6>
              {!showPasswordForm && (
                <button onClick={() => setShowPasswordForm(true)} className="as-btn as-btn-outline btn-sm px-3 profile-meta-text">
                  <i className="bi bi-pencil me-1"></i>Change
                </button>
              )}
            </div>

            {passwordSuccess && (
              <div className="as-badge-active p-2 rounded mb-3 success-banner">
                <i className="bi bi-check-circle me-2"></i>Password changed successfully!
              </div>
            )}

            {!showPasswordForm ? (
              <p className="as-text-soft m-0 success-banner">Manage your password securely here.</p>
            ) : (
              <div>
                {passwordError && (
                  <div className="as-badge-inactive p-2 rounded mb-3 error-banner">
                    <i className="bi bi-exclamation-circle me-2"></i>{passwordError}
                  </div>
                )}
                <div className="mb-3">
                  <label className="as-label">Current Password</label>
                  <div className="position-relative">
                    <input type={showCurrent ? 'text' : 'password'} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="as-input input-with-icon" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="btn password-toggle-btn">
                      <i className={showCurrent ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="as-label">New Password</label>
                  <div className="position-relative">
                    <input type={showNew ? 'text' : 'password'} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="as-input input-with-icon" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="btn password-toggle-btn">
                      <i className={showNew ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="as-label">Confirm Password</label>
                  <div className="position-relative">
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="as-input input-with-icon" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="btn password-toggle-btn">
                      <i className={showConfirm ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                    </button>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button onClick={handlePasswordSubmit} disabled={passwordLoading} className="as-btn as-btn-primary flex-grow-1 py-2">
                    {passwordLoading ? 'Saving...' : 'Save Password'}
                  </button>
                  <button onClick={() => { setShowPasswordForm(false); setPasswordError(null) }} className="as-btn as-btn-outline px-3 py-2">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showAvatarModal && <ProfileImageModal currentName={adminName} onClose={() => setShowAvatarModal(false)} />}
    </div>
  )
}

export default AdminSettings
