import { useState } from 'react'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useAdmin } from '../context/DashboardContext'
import './Login.css'

const adminRegisterSchema = Yup.object({
  fullName: Yup.string().trim().required('Full name is required'),
  email: Yup.string().trim().email('Enter a valid admin email').required('Admin email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
})

const AdminRegister = () => {
  const { createAdmin } = useAdmin()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)
  const [success, setSuccess]           = useState(false)

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: adminRegisterSchema,
    onSubmit: async (values) => {
      setError(null)
      setLoading(true)
      const result = await createAdmin({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      setLoading(false)

      if (result?.success) {
        setSuccess(true)
        setTimeout(() => navigate('/admin/admins'), 2000)
      } else {
        setError(result?.message || 'Failed to create admin account')
      }
    },
  })

  const handleFieldChange = (e) => {
    if (error) setError(null)
    formik.handleChange(e)
  }

  const getFieldError = (field) => formik.touched[field] && formik.errors[field]
  const passwordsMatch    = formik.touched.confirmPassword && formik.values.confirmPassword && formik.values.confirmPassword === formik.values.password
  const passwordsMismatch = getFieldError('confirmPassword')

  return (
    <div className="auth-page-container">

      {/* ── LEFT PANEL ── */}
      <div className="d-none d-lg-flex flex-column justify-content-between auth-left-panel">
        <div className="auth-circle-1" />
        <div className="auth-circle-2" />

        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none position-relative z-1">
          <div className="auth-logo-box"><i className="bi bi-cloud-sun-fill text-success"></i></div>
          <span className="auth-logo-text">SmartAgriClimate Admin</span>
        </Link>

        <div className="position-relative z-1">
          <div className="auth-welcome-icon"><i className="bi bi-shield-fill-check text-success fs-2"></i></div>
          <h2 className="auth-welcome-title">
            Register a<br />
            <span className="auth-welcome-accent">new admin.</span>
          </h2>
          <p className="auth-welcome-desc">
            Only the Super Admin can create new admin accounts. New admins will have access to farmer management and weather rules.
          </p>
          <div className="d-flex flex-column gap-3">
            {[
              'Full access to farmer management',
              'Can edit weather rule thresholds',
              'Can activate and deactivate farmers',
              'Admin management restricted to Super Admin',
            ].map((item) => (
              <div key={item} className="d-flex align-items-start gap-3">
                <div className="auth-logo-box bg-opacity-25 border-opacity-50 mt-1" style={{ width: 22, height: 22 }}>
                  <i className="bi bi-check fs-6 text-success"></i>
                </div>
                <span className="text-success opacity-75 fs-7">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="position-relative z-1">
          <Link to="/admin/login" className="as-text-primary text-decoration-none fw-bold fs-7">
            ← Back to Admin Login
          </Link>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right-panel">

        {/* Mobile logo */}
        <div className="d-flex d-lg-none auth-mobile-header">
          <i className="bi bi-cloud-sun-fill text-success fs-4 me-2"></i>
          <span className="auth-logo-text">SmartAgriClimate Admin</span>
        </div>

        <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
          <div className="auth-form-wrapper">

            <div className="mb-4">
              <h3 className="auth-form-title">New Admin Account</h3>
              <p className="auth-form-subtitle">Creating a regular admin account</p>
            </div>

            {/* Super admin context banner */}
            <div className="as-badge-inactive d-flex align-items-center gap-3 p-3 mb-4 rounded border-opacity-50">
              <i className="bi bi-shield-check fs-4"></i>
              <p className="m-0 fs-7 opacity-75">
                This form is only accessible by the <strong>Super Admin</strong>. The new account will have regular admin privileges.
              </p>
            </div>

            {/* Success banner */}
            {success && (
              <div className="as-badge-active d-flex align-items-center gap-2 p-3 mb-3 rounded border-opacity-50">
                <i className="bi bi-check-circle fs-5"></i>
                <p className="m-0 fs-7">Admin account created! Redirecting to admins list...</p>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="auth-api-error-box">
                <p className="auth-error-text m-0">
                  <i className="bi bi-exclamation-circle me-2"></i>{error}
                </p>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} noValidate>
              {/* Full Name */}
              <div className="mb-3">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-person auth-input-icon"></i>
                  <input
                    type="text"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. Kola Adesanya"
                    className={`form-control auth-input-field ${getFieldError('fullName') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                  />
                </div>
                {getFieldError('fullName') && <p className="auth-error-text"><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="auth-label">Admin Email</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-envelope auth-input-icon"></i>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    placeholder="admin@smartagriclimate.com"
                    className={`form-control auth-input-field ${getFieldError('email') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                  />
                </div>
                {getFieldError('email') && <p className="auth-error-text"><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.email}</p>}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-lock auth-input-icon"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formik.values.password}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    placeholder="Create a strong password"
                    className={`form-control auth-input-field ${getFieldError('password') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-pass-toggle">
                    <i className={showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                  </button>
                </div>
                <p className={`auth-error-text ${getFieldError('password') ? '' : 'as-text-primary'}`}>
                  {getFieldError('password')
                     ? <><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.password}</>
                    : <>Min 8 chars · uppercase · lowercase · number · special character (@$!%*?&_#)</>
                  }
                </p>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label className="auth-label">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-lock-fill auth-input-icon"></i>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    placeholder="Repeat the password"
                    className={`form-control auth-input-field ${passwordsMismatch ? 'auth-input-field-error' : passwordsMatch ? 'border-success' : 'auth-input-field-normal'}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="auth-pass-toggle">
                    <i className={showConfirm ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                  </button>
                </div>
                {passwordsMismatch && <p className="auth-error-text"><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.confirmPassword}</p>}
                {passwordsMatch && <p className="as-text-primary fs-7 mt-1"><i className="bi bi-check-circle me-1"></i>Passwords match</p>}
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className={`btn w-100 py-3 auth-submit-btn ${success ? 'as-btn-inactive' : ''}`}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
                  : success
                  ? <><i className="bi bi-check-lg me-2"></i>Account Created!</>
                  : <><i className="bi bi-shield-check me-2"></i>Create Admin Account</>
                }
              </button>
            </form>

            <div className="text-center mt-3">
              <Link to="/admin/admins" className="as-text-soft text-decoration-none fs-7">
                ← Back to Dashboard
              </Link>
            </div>

          </div>
        </div>

        <div className="text-center pb-4">
          <p className="auth-footer-text">© 2026 SmartAgriClimate. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default AdminRegister
