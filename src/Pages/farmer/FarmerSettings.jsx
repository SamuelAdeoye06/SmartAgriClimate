import React, { useState, useEffect } from 'react'
import { useFarmer } from '../../context/DashboardContext'
import { useAuth } from '../../context/AuthContext'
import ProfileImageModal from '../../components/ProfileImageModal'
import api from '../../api/axios'
import './FarmerSettings.css'
import LocationSelector from '../../components/LocationSelector'
import { STATES, getCities } from '../../data/nigeriaLocations'
import { useNavigate } from 'react-router-dom'

// ── Crop categories list ──
const CROP_CATEGORIES = [
    { value: "grains",     icon: "🌾", label: "Grains & Cereals",   sub: "maize, rice, sorghum, millet" },
    { value: "tubers",     icon: "🥔", label: "Tubers & Roots",      sub: "cassava, yam, cocoyam" },
    { value: "legumes",    icon: "🫘", label: "Legumes & Pulses",    sub: "beans, cowpea, groundnut" },
    { value: "vegetables", icon: "🍅", label: "Vegetables",          sub: "tomatoes, peppers, okra" },
    { value: "plantains",  icon: "🍌", label: "Plantains & Bananas", sub: "plantain, banana" },
    { value: "fruits",     icon: "🍊", label: "Fruits",              sub: "mango, citrus, pawpaw" },
    { value: "cash_crops", icon: "🌴", label: "Cash Crops",          sub: "cocoa, oil palm, rubber" },
    { value: "herbs",      icon: "🌿", label: "Herbs & Spices",      sub: "ginger, turmeric, garlic" },
]

// ── CropProfileSelector sub-component ──
// Lives in this file so it can be used directly below
const CropProfileSelector = ({ selected, onChange }) => {
    const [local, setLocal]     = useState([])
    const [saving, setSaving]   = useState(false)
    const [success, setSuccess] = useState(false)

    // sync from props when cropProfiles loads from context
    // (context loads async so initial render may have empty array)
    useEffect(() => {
        setLocal(selected || [])
    }, [selected])

    const toggle = (value) => {
        setLocal((prev) =>
            prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
        )
    }

    const handleSave = async () => {
        setSaving(true)
        await onChange(local)
        setSaving(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2500)
    }

    return (
        <div>
            <div className="crop-profile-grid mb-3">
                {CROP_CATEGORIES.map((cat) => {
                    const isSelected = local.includes(cat.value)
                    return (
                        <button
                            key={cat.value}
                            type="button"
                            onClick={() => toggle(cat.value)}
                            className={`crop-profile-btn ${isSelected ? 'crop-profile-btn-selected' : ''}`}
                        >
                            <span className="crop-btn-icon">{cat.icon}</span>
                            <div className="crop-btn-text">
                                <div className="crop-btn-label">{cat.label}</div>
                                <div className="crop-btn-sub">{cat.sub}</div>
                            </div>
                            {isSelected && <i className="bi bi-check-circle-fill crop-btn-check"></i>}
                        </button>
                    )
                })}
            </div>

            {success && (
                <div className="as-badge-active p-2 rounded mb-2 d-inline-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-check-circle"></i> Crop profiles saved!
                </div>
            )}

            <button onClick={handleSave} disabled={saving} className="as-btn as-btn-primary px-4 py-2">
                {saving
                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    : 'Save Crop Profiles'
                }
            </button>
        </div>
    )
}

// ── Main FarmerSettings component ──
const FarmerSettings = () => {
    const { farmerName, setFarmerName, location, setLocation, cropProfiles, setCropProfiles, loadWeather } = useFarmer()  
    const { user, logout, updateUser } = useAuth()
    const navigate = useNavigate()

    const [showAvatarModal, setShowAvatarModal] = useState(false)
    const [editingName, setEditingName]         = useState(false)
    const [tempName, setTempName]               = useState(farmerName)
    const [nameSaved, setNameSaved]             = useState(false)
    const [editingLocation, setEditingLocation] = useState(false)
    const [tempState, setTempState]             = useState('')
    const [tempCity, setTempCity]               = useState('')    
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    // Password state
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [passwordData, setPasswordData]         = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [showCurrent, setShowCurrent]           = useState(false)
    const [showNew, setShowNew]                   = useState(false)
    const [showConfirm, setShowConfirm]           = useState(false)
    const [passwordLoading, setPasswordLoading]   = useState(false)
    const [passwordError, setPasswordError]       = useState(null)
    const [passwordSuccess, setPasswordSuccess]   = useState(false)


    const [deleteStep, setDeleteStep]     = useState('confirm') // 'confirm' | 'otp'
    const [deleteOtp, setDeleteOtp]       = useState('')
    const [deleteError, setDeleteError]   = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)


    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
        setPasswordError(null)
    }

    const handlePasswordSubmit = async () => {
        setPasswordError(null)
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword)
            return setPasswordError('All password fields are required')
        if (passwordData.newPassword !== passwordData.confirmPassword)
            return setPasswordError('New passwords do not match')
        if (passwordData.newPassword.length < 8)
            return setPasswordError('New password must be at least 8 characters')
        try {
            setPasswordLoading(true)
            await api.patch('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword:     passwordData.newPassword,
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

    const handleNameSave = async () => {
        if (!tempName.trim()) return
        try {
            const { data } = await api.patch('/auth/update-profile', { fullName: tempName.trim() })
            setFarmerName(tempName)
            updateUser(data.user)
            setEditingName(false)
            setNameSaved(true)
            setTimeout(() => setNameSaved(false), 2500)
        } catch (err) {
            console.error('Failed to save name:', err.message)
        }
    }   

    const handleLocationSave = async () => {
        if (!tempState || !tempCity) return
        const newLocation = `${tempCity}, ${tempState}`
        try {
            const { data } = await api.patch('/auth/update-profile', { farmLocation: newLocation })
            setLocation(newLocation)
            updateUser(data.user)  // ✅ sync localStorage
            await api.post('/weather/refresh')
            setEditingLocation(false)
            loadWeather()
        } catch (err) {
            console.error('Failed to save location:', err.message)
        }
    }

    // called by CropProfileSelector when farmer saves
    const handleCropProfileSave = async (newProfiles) => {
        try {
            const { data } = await api.patch('/auth/update-profile', { cropProfiles: newProfiles })
            setCropProfiles(newProfiles)
            updateUser(data.user)  // ✅ sync localStorage so refresh works
        } catch (err) {
            console.error("Failed to save crop profiles:", err.message)
        }
    }

    // const handleDeleteAccount = async () => {
    //     try { await deleteAccount() }
    //     catch (err) { console.error("Failed to delete account:", err) }
    // }

    const handleRequestDeleteOTP = async () => {
        setDeleteError(null)
        setDeleteLoading(true)
        try {
            await api.post('/auth/send-otp')
            setDeleteStep('otp')
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Failed to send OTP. Try again.')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleVerifyDeleteOTP = async () => {
        if (deleteOtp.length !== 6) return setDeleteError('Please enter the full 6-digit OTP')
        setDeleteError(null)
        setDeleteLoading(true)
        try {
            await api.post('/auth/verify-otp', { otp: deleteOtp })
            logout()  // ✅ clears session and redirects to /login
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Invalid OTP. Please try again.')
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="farmer-settings-container">
            <div className="as-section-header mb-4">
                <div className="as-header-line" />
                <h5 className="as-section-title">Settings</h5>
            </div>

            {/* Profile banner */}
            <div className="as-card farmer-profile-card p-4 mb-4">
                <div className="farmer-header-banner"></div>
                <div className="d-flex flex-column flex-md-row align-items-center gap-4 farmer-profile-content">
                    <div className="position-relative">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={farmerName} className="as-avatar farmer-avatar-image" />
                        ) : (
                            <div className="as-avatar-placeholder farmer-avatar-placeholder-large">
                                {farmerName?.[0] || 'F'}
                            </div>
                        )}
                        <button onClick={() => setShowAvatarModal(true)} className="as-btn farmer-avatar-edit-btn">
                            <i className="bi bi-camera-fill avatar-edit-icon"></i>
                        </button>
                    </div>
                    <div className="text-center text-md-start">
                        <h4 className="as-text-primary farmer-name-display m-0">{farmerName}</h4>
                        <p className="as-text-soft m-0 mt-1 farmer-location-sub">
                            <i className="bi bi-geo-alt me-1"></i>{location}
                        </p>
                        {cropProfiles?.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mt-2">
                                {cropProfiles.map((c) => {
                                    const cat = CROP_CATEGORIES.find(x => x.value === c)
                                    return cat ? (
                                        <span key={c} className="as-badge as-badge-active" style={{ fontSize: '0.7rem' }}>
                                            {cat.icon} {cat.label}
                                        </span>
                                    ) : null
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Personal info */}
                <div className="col-12 col-lg-6">
                    <div className="as-card">
                        <h6 className="as-text-primary fw-bold mb-3">
                            <i className="bi bi-person me-2 as-text-primary"></i>Personal Info
                        </h6>
                        <div className="mb-3">
                            <label className="as-label">Full Name</label>
                            {editingName ? (
                                <div>
                                    <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="as-input mb-2" />
                                    <div className="d-flex gap-2">
                                        <button onClick={handleNameSave} className="as-btn as-btn-primary btn-sm px-3 py-1">Save</button>
                                        <button onClick={() => setEditingName(false)} className="as-btn as-btn-outline btn-sm px-3 py-1">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="as-text-primary fw-bold">{farmerName}</span>
                                    <button onClick={() => setEditingName(true)} className="btn btn-sm p-0 as-text-primary"><i className="bi bi-pencil"></i></button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="as-label">Email Address</label>
                            <div className="as-input farmer-input-readonly">
                                <i className="bi bi-lock me-2"></i>{user?.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Farm location */}
                <div className="col-12 col-lg-6">
                    <div className="as-card">
                        <h6 className="as-text-primary fw-bold mb-3">
                            <i className="bi bi-geo-alt me-2 as-text-primary"></i>Farm Location
                        </h6>

                        {editingLocation ? (
                            <div>
                                <LocationSelector
                                    selectedState={tempState}
                                    selectedCity={tempCity}
                                    onStateChange={(s) => { setTempState(s); setTempCity('') }}
                                    onCityChange={setTempCity}
                                    states={STATES}
                                    getCities={getCities}
                                />
                                <div className="d-flex gap-2 mt-3">
                                    <button
                                        onClick={handleLocationSave}
                                        disabled={!tempState || !tempCity}
                                        className="as-btn as-btn-primary btn-sm px-3 py-1"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditingLocation(false)}
                                        className="as-btn as-btn-outline btn-sm px-3 py-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="as-text-accent fw-bold">📍 {location}</span>
                                <button
                                    onClick={() => setEditingLocation(true)}
                                    className="btn btn-sm p-0 as-text-primary"
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Crop profiles — full width */}
                <div className="col-12">
                    <div className="as-card">
                        <h6 className="as-text-primary fw-bold mb-1">
                            <i className="bi bi-flower1 me-2 as-text-primary"></i>Crop Profiles
                        </h6>
                        <p className="as-text-soft mb-3" style={{ fontSize: '0.82rem' }}>
                            Select all crop categories you grow. Your forecast advice will be tailored to these crops.
                        </p>
                        <CropProfileSelector
                            selected={cropProfiles}
                            onChange={handleCropProfileSave}
                        />
                    </div>
                </div>

                {/* Change password */}
                <div className="col-12 col-lg-6">
                    <div className="as-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="as-text-primary fw-bold m-0">
                                <i className="bi bi-key me-2 as-text-primary"></i>Change Password
                            </h6>
                            {!showPasswordForm && (
                                <button onClick={() => setShowPasswordForm(true)} className="as-btn as-btn-outline btn-sm px-3 farmer-btn-status-small">
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
                            <p className="as-text-soft m-0">Secure your account by updating your password regularly.</p>
                        ) : (
                            <div>
                                {passwordError && (
                                    <div className="as-badge-inactive p-2 rounded mb-3 error-banner">
                                        <i className="bi bi-exclamation-circle me-2"></i>{passwordError}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="as-label">Current Password</label>
                                    <div className="farmer-password-input-wrapper">
                                        <input type={showCurrent ? 'text' : 'password'} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="as-input farmer-password-input" />
                                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="btn farmer-password-toggle">
                                            <i className={showCurrent ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="as-label">New Password</label>
                                    <div className="farmer-password-input-wrapper">
                                        <input type={showNew ? 'text' : 'password'} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="as-input farmer-password-input" />
                                        <button type="button" onClick={() => setShowNew(!showNew)} className="btn farmer-password-toggle">
                                            <i className={showNew ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="as-label">Confirm Password</label>
                                    <div className="farmer-password-input-wrapper">
                                        <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="as-input farmer-password-input" />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="btn farmer-password-toggle">
                                            <i className={showConfirm ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button onClick={handlePasswordSubmit} disabled={passwordLoading} className="as-btn as-btn-primary flex-grow-1 py-2">
                                        {passwordLoading ? 'Saving...' : 'Save Password'}
                                    </button>
                                    <button onClick={() => setShowPasswordForm(false)} className="as-btn as-btn-outline px-3 py-2">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Account actions */}
                <div className="col-12 col-lg-6">
                    <div className="as-card">
                        <h6 className="as-text-primary fw-bold mb-3">
                            <i className="bi bi-shield me-2 as-text-primary"></i>Account Actions
                        </h6>
                        <div className="d-flex flex-column gap-2">
                            <button onClick={() => logout()} className="as-btn as-btn-outline w-100 py-2 justify-content-start farmer-logout-btn">
                                <i className="bi bi-box-arrow-right me-2"></i>Logout
                            </button>
                            <button onClick={() => setShowDeleteModal(true)} className="as-btn as-btn-danger w-100 py-2 justify-content-start">
                                <i className="bi bi-trash3 me-2"></i>Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete modal */}
            {showDeleteModal && (
                <div className="farmer-delete-modal-overlay" onClick={() => {
                    setShowDeleteModal(false)
                    setDeleteStep('confirm')
                    setDeleteOtp('')
                    setDeleteError(null)
                }}>
                    <div className="as-card farmer-delete-modal-card" onClick={(e) => e.stopPropagation()}>

                        {deleteStep === 'confirm' && (
                            <>
                                <div className="text-center mb-4">
                                    <div className="delete-alert-icon-wrapper">🗑️</div>
                                    <h5 className="as-text-primary fw-bold mb-2">Delete Your Account?</h5>
                                    <p className="as-text-soft m-0 delete-modal-text-desc">
                                        This cannot be undone. All your data including saved dates and crop profiles will be permanently lost,an OTP will be sent to your mail to confirm delete
                                    </p>
                                </div>
                                {deleteError && (
                                    <div className="as-badge-inactive p-2 rounded mb-3 text-center" style={{ fontSize: '0.8rem' }}>
                                        <i className="bi bi-exclamation-circle me-1"></i>{deleteError}
                                    </div>
                                )}
                                <div className="d-flex gap-3">
                                    <button
                                        onClick={() => { setShowDeleteModal(false); setDeleteError(null) }}
                                        className="as-btn as-btn-outline flex-grow-1 py-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRequestDeleteOTP}
                                        disabled={deleteLoading}
                                        className="as-btn flex-grow-1 py-2 confirm-delete-account-btn"
                                    >
                                        {deleteLoading
                                            ? <><span className="spinner-border spinner-border-sm me-1" /> Sending OTP..</>
                                            : 'Yes, Delete'
                                        }
                                    </button>
                                </div>
                            </>
                        )}

                        {deleteStep === 'otp' && (
                            <>
                                <div className="text-center mb-4">
                                    <div className="delete-alert-icon-wrapper">📧</div>
                                    <h5 className="as-text-primary fw-bold mb-2">Confirm with OTP</h5>
                                    <p className="as-text-soft m-0 delete-modal-text-desc">
                                        A 6-digit code was sent to <strong>{user?.email}</strong>. Enter it below to confirm deletion.
                                    </p>
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={deleteOtp}
                                        onChange={(e) => { setDeleteOtp(e.target.value.replace(/\D/g, '')); setDeleteError(null) }}
                                        placeholder="Enter 6-digit OTP"
                                        className="as-input text-center fw-bold"
                                        style={{ letterSpacing: '8px', fontSize: '1.2rem' }}
                                    />
                                </div>

                                {deleteError && (
                                    <div className="as-badge-inactive p-2 rounded mb-3 text-center" style={{ fontSize: '0.8rem' }}>
                                        <i className="bi bi-exclamation-circle me-1"></i>{deleteError}
                                    </div>
                                )}

                                <div className="d-flex gap-3 mb-3">
                                    <button
                                        onClick={() => { setDeleteStep('confirm'); setDeleteOtp(''); setDeleteError(null) }}
                                        className="as-btn as-btn-outline flex-grow-1 py-2"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleVerifyDeleteOTP}
                                        disabled={deleteLoading || deleteOtp.length !== 6}
                                        className="as-btn flex-grow-1 py-2 confirm-delete-account-btn"
                                    >
                                        {deleteLoading
                                            ? <><span className="spinner-border spinner-border-sm me-1" /> Deleting...</>
                                            : 'Confirm Delete'
                                        }
                                    </button>
                                </div>

                                <p className="text-center as-text-soft" style={{ fontSize: '0.78rem' }}>
                                    Didn't receive it?{' '}
                                    <button
                                        onClick={handleRequestDeleteOTP}
                                        className="btn btn-link p-0 as-text-accent fw-bold text-decoration-none"
                                        style={{ fontSize: '0.78rem' }}
                                    >
                                        Resend OTP
                                    </button>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {showAvatarModal && (
                <ProfileImageModal currentName={farmerName} onClose={() => setShowAvatarModal(false)} />
            )}
        </div>
    )
}

export default FarmerSettings