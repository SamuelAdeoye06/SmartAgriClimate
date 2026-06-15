import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { Icon } from '../utils/iconMap'
import './Login.css'
import './ForgotPassword.css'

const ForgotPassword = () => {
    const [step, setStep]                       = useState(1)
    const [email, setEmail]                     = useState('')
    const [otp, setOtp]                         = useState('')
    const [newPassword, setNewPassword]         = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNew, setShowNew]                 = useState(false)
    const [showConfirm, setShowConfirm]         = useState(false)
    const [loading, setLoading]                 = useState(false)
    const [error, setError]                     = useState(null)
    const [success, setSuccess]                 = useState(false)

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/

    const handleSendOTP = async () => {
        if (!email.trim()) return setError('Please enter your email address')
        setError(null)
        setLoading(true)
        try {
            await api.post('/auth/forgot-password', { email: email.trim() })
            setStep(2)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async () => {
        if (!otp.trim()) return setError('Please enter the OTP sent to your email')
        if (otp.length !== 6) return setError('OTP must be 6 digits')
        setError(null)
        setLoading(true)
        try {
            await api.post('/auth/verify-forgot-password', { email, otp })
            setStep(3)
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired OTP.')
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) return setError('Please fill in both password fields')
        if (!passwordRegex.test(newPassword)) return setError('Password must be at least 8 characters with uppercase, lowercase, number and special character (@$!%*?&_#)')
        if (newPassword !== confirmPassword) return setError('Passwords do not match')
        setError(null)
        setLoading(true)
        try {
            await api.post('/auth/reset-password', { email, newPassword })
            setSuccess(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const stepLabels = ['Enter Email', 'Verify OTP', 'New Password']

    return (
        <div className="auth-page-container">

            {/* ── Left panel ── */}
            <div className="d-none d-lg-flex flex-column justify-content-between auth-left-panel">
                <div className="auth-circle-1" />
                <div className="auth-circle-2" />
                <div className="auth-circle-3" />

                <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none position-relative z-1">
                    <div className="auth-logo-box"><i className="bi bi-cloud-sun-fill text-success"></i></div>
                    <span className="auth-logo-text">SmartAgriClimate</span>
                </Link>

                <div className="position-relative z-1">
                    <div className="auth-welcome-icon"><i className="bi bi-shield-lock-fill text-success fs-2"></i></div>
                    <h2 className="auth-welcome-title">
                        Reset your<br />
                        <span className="auth-welcome-accent">Password.</span>
                    </h2>
                    <p className="auth-welcome-desc">
                        We'll send a secure one-time code to your email. Use it to verify your identity and set a new password.
                    </p>
                </div>

                <div className="auth-quote-box">
                    <p className="auth-quote-text">
                        "Security is not a product, but a process."
                    </p>
                </div>
            </div>

            {/* ── Right panel ── */}
            <div className="auth-right-panel">

                <Link to="/" className="d-flex d-lg-none auth-mobile-header text-decoration-none">
                    <i className="bi bi-cloud-sun-fill text-success fs-4 me-2"></i>
                    <span className="auth-logo-text">SmartAgriClimate</span>
                </Link>

                <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
                    <div className="auth-form-wrapper">

                        {/* Step indicator */}
                        <div className="fp-steps">
                            {stepLabels.map((label, i) => (
                                <div key={i} className="fp-step-block">
                                    <div className={`fp-step-circle ${i + 1 <= step ? 'active' : 'inactive'}`}>
                                        {i + 1 < step ? <Icon name="clear" /> : i + 1}
                                    </div>
                                    <span className={`fp-step-label ${i + 1 <= step ? 'active' : 'inactive'}`}>
                                        {label}
                                    </span>
                                    {i < 2 && (
                                        <div className={`fp-step-line ${i + 1 < step ? 'active' : 'inactive'}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ── Success ── */}
                        {success ? (
                            <div className="text-center">
                                <div className="fp-success-icon"><i className="bi bi-check-circle-fill text-success fs-1"></i></div>
                                <h3 className="auth-form-title">Password Reset!</h3>
                                <p className="auth-form-subtitle mb-4">
                                    Your password has been updated successfully. You can now sign in with your new password.
                                </p>
                                <Link to="/login" className="btn w-100 py-3 auth-submit-btn text-decoration-none">
                                    Go to Sign In &nbsp;<i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        ) : (
                            <>
                                {/* ── Step 1: Email ── */}
                                {step === 1 && (
                                    <div>
                                        <div className="mb-4">
                                            <h3 className="auth-form-title">Forgot Password?</h3>
                                            <p className="auth-form-subtitle">
                                                Enter the email address linked to your SmartAgriClimate account and we'll send you an OTP.
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="auth-label">Email Address</label>
                                            <div className="auth-input-wrapper">
                                                <i className="bi bi-envelope auth-input-icon"></i>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => { setEmail(e.target.value); setError(null) }}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                                                    placeholder="you@example.com"
                                                    className="form-control auth-input-field auth-input-field-normal"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="auth-api-error-box mb-3">
                                                <p className="auth-error-text m-0">
                                                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleSendOTP}
                                            disabled={loading}
                                            className="btn w-100 py-3 auth-submit-btn"
                                        >
                                            {loading
                                                ? <><span className="spinner-border spinner-border-sm me-2" />Sending OTP...</>
                                                : <>Send OTP &nbsp;<i className="bi bi-send"></i></>
                                            }
                                        </button>

                                        <p className="text-center mt-3 auth-form-subtitle">
                                            Remember your password?{' '}
                                            <Link to="/login" className="as-text-accent fw-bold text-decoration-none">Sign in</Link>
                                        </p>
                                    </div>
                                )}

                                {/* ── Step 2: OTP ── */}
                                {step === 2 && (
                                    <div>
                                        <div className="mb-4">
                                            <h3 className="auth-form-title">Enter OTP</h3>
                                            <p className="auth-form-subtitle">
                                                We sent a 6-digit code to <strong>{email}</strong>. It expires in 10 minutes.
                                            </p>
                                        </div>

                                        <div className="mb-4">
                                            <label className="auth-label">One-Time Password</label>
                                            <div className="auth-input-wrapper">
                                                <i className="bi bi-shield-lock auth-input-icon"></i>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(null) }}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                                                    placeholder="Enter 6-digit OTP"
                                                    className="form-control auth-input-field auth-input-field-normal fp-otp-input"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="auth-api-error-box mb-3">
                                                <p className="auth-error-text m-0">
                                                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleVerifyOTP}
                                            disabled={loading}
                                            className="btn w-100 py-3 auth-submit-btn mb-3"
                                        >
                                            {loading
                                                ? <><span className="spinner-border spinner-border-sm me-2" />Verifying...</>
                                                : <>Verify OTP &nbsp;<i className="bi bi-shield-check"></i></>
                                            }
                                        </button>

                                        <p className="text-center auth-form-subtitle">
                                            Didn't get it?{' '}
                                            <button
                                                onClick={() => { setStep(1); setOtp(''); setError(null) }}
                                                className="fp-text-link as-text-accent fw-bold"
                                            >
                                                Resend OTP
                                            </button>
                                        </p>
                                    </div>
                                )}

                                {/* ── Step 3: New Password ── */}
                                {step === 3 && (
                                    <div>
                                        <div className="mb-4">
                                            <h3 className="auth-form-title">Set New Password</h3>
                                            <p className="auth-form-subtitle">
                                                Choose a strong password you haven't used before.
                                            </p>
                                        </div>

                                        <div className="mb-3">
                                            <label className="auth-label">New Password</label>
                                            <div className="auth-input-wrapper">
                                                <i className="bi bi-lock auth-input-icon"></i>
                                                <input
                                                    type={showNew ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={(e) => { setNewPassword(e.target.value); setError(null) }}
                                                    placeholder="Enter new password"
                                                    className="form-control auth-input-field auth-input-field-normal"
                                                />
                                                <button type="button" onClick={() => setShowNew(!showNew)} className="auth-pass-toggle">
                                                    <i className={showNew ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="auth-label">Confirm Password</label>
                                            <div className="auth-input-wrapper">
                                                <i className="bi bi-lock auth-input-icon"></i>
                                                <input
                                                    type={showConfirm ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={(e) => { setConfirmPassword(e.target.value); setError(null) }}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                                                    placeholder="Confirm new password"
                                                    className="form-control auth-input-field auth-input-field-normal"
                                                />
                                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="auth-pass-toggle">
                                                    <i className={showConfirm ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                                                </button>
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="auth-api-error-box mb-3">
                                                <p className="auth-error-text m-0">
                                                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                                                </p>
                                            </div>
                                        )}

                                        <button
                                            onClick={handleResetPassword}
                                            disabled={loading}
                                            className="btn w-100 py-3 auth-submit-btn"
                                        >
                                            {loading
                                                ? <><span className="spinner-border spinner-border-sm me-2" />Resetting...</>
                                                : <>Reset Password &nbsp;<i className="bi bi-check-lg"></i></>
                                            }
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="text-center pb-4">
                    <p className="auth-footer-text">© 2026 SmartAgriClimate. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
