import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import './ProfileImageModal.css'

const ProfileImageModal = ({ onClose, currentName }) => {
  const { user, uploadAvatar } = useAuth()
  const [preview, setPreview]     = useState(null)
  const [base64, setBase64]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [success, setSuccess]     = useState(false)
  const fileInputRef              = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      return setError('Please select an image file')
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError('Image must be less than 5MB')
    }

    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      setBase64(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!base64) return
    setLoading(true)
    setError(null)

    const result = await uploadAvatar(base64)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1500)
    } else {
      setError(result.message)
    }
    setLoading(false)
  }

  const handleRemove = () => {
    setPreview(null)
    setBase64(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const displayImage = preview || user?.avatarUrl || null
  const initial      = (currentName || user?.fullName || 'U')[0].toUpperCase()

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn">
          <i className="bi bi-x-lg"></i>
        </button>

        <h5 className="modal-title">Profile Picture</h5>
        <p className="modal-subtitle">Upload a new photo or keep your current one.</p>

        <div className="avatar-preview-container">
          <div className="avatar-preview-wrapper">
            {displayImage ? (
              <img src={displayImage} alt="Profile" className="avatar-preview-img" />
            ) : (
              <div className="avatar-preview-placeholder">{initial}</div>
            )}

            {preview && (
              <button onClick={handleRemove} className="remove-preview-btn">
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>

          {preview && (
            <span className="selected-badge">
              <i className="bi bi-check-circle me-1"></i>New photo selected
            </span>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="d-none"
          id="avatar-input"
        />

        <label htmlFor="avatar-input" className="file-input-label">
          <i className="bi bi-cloud-upload me-1"></i>
          {preview ? 'Choose a different photo' : 'Choose a photo'}
        </label>

        <p className="file-hint">JPG, PNG or GIF · Max 5MB</p>

        {error && (
          <div className="as-badge-inactive p-2 rounded mb-3 error-banner">
            <p className="m-0"><i className="bi bi-exclamation-circle me-1"></i>{error}</p>
          </div>
        )}
        {success && (
          <div className="as-badge-active p-2 rounded mb-3 success-banner">
            <p className="m-0"><i className="bi bi-check-circle me-1"></i>Profile picture updated!</p>
          </div>
        )}

        <div className="d-flex gap-3">
          <button onClick={onClose} className="as-btn as-btn-outline flex-grow-1 py-2">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!base64 || loading}
            className="as-btn as-btn-primary flex-grow-1 py-2 modal-save-btn"
          >
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
            {loading ? 'Saving...' : 'Save Photo'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileImageModal