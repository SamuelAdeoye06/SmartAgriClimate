import { useState } from 'react'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const adminLoginSchema = Yup.object({
  email: Yup.string().trim().email('Enter a valid admin email').required('Admin email is required'),
  password: Yup.string().required('Password is required'),
})

const AdminLogin = () => {
  const { login, error, setError } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: adminLoginSchema,
    onSubmit: async (values) => {
      setError(null)
      setLoading(true)
      await login({ email: values.email.trim(), password: values.password })
      setLoading(false)
    },
  })

  const handleFieldChange = (e) => {
    if (error) setError(null)
    formik.handleChange(e)
  }

  const getFieldError = (field) => formik.touched[field] && formik.errors[field]

  return (
    <div className="auth-page-container">

      {/* ── LEFT PANEL ── */}
      <div className="d-none d-lg-flex flex-column justify-content-between auth-left-panel">
        <div className="auth-circle-1" />
        <div className="auth-circle-2" />
        <div className="auth-circle-3" />

        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none position-relative z-1">
          <div className="auth-logo-box"><i className="bi bi-cloud-sun-fill text-success"></i></div>
          <span className="auth-logo-text">SmartAgriClimate Admin</span>
        </Link>

        <div className="position-relative z-1">
          <div className="auth-welcome-icon"><i className="bi bi-shield-fill-check text-success fs-2"></i></div>
          <h2 className="auth-welcome-title">
            Welcome back,<br />
            <span className="auth-welcome-accent">Admin.</span>
          </h2>
          <p className="auth-welcome-desc">
            Manage farmers, monitor platform activity, and control weather rules from one secure panel.
          </p>

          {/* Access info pills */}
          <div className="d-flex flex-column gap-2">
            {[
              { icon: 'bi-people', label: 'Manage all farmer accounts' },
              { icon: 'bi-sliders', label: 'Control weather thresholds' },
              { icon: 'bi-shield-check', label: 'Register new admins' },
            ].map((item) => (
              <div key={item.label} className="as-badge-inactive d-flex align-items-center gap-3 border-opacity-25 py-2 px-3">
                <i className={`bi ${item.icon} text-success`}></i>
                <span className="text-success opacity-75 fs-7">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="auth-quote-box border-success">
          <p className="auth-quote-text">
            Restricted access · Authorized personnel only
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right-panel">

        <div className="d-flex d-lg-none auth-mobile-header">
          <i className="bi bi-cloud-sun-fill text-success fs-4 me-2"></i>
          <span className="auth-logo-text">SmartAgriClimate Admin</span>
        </div>

        <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
          <div className="auth-form-wrapper">

            <div className="d-lg-none text-center mb-4">
              <div className="fs-1"><i className="bi bi-shield-lock-fill text-success"></i></div>
            </div>

            <div className="mb-4">
              <h3 className="auth-form-title">Admin Sign In</h3>
              <p className="auth-form-subtitle">
                Access your administrator dashboard
              </p>
            </div>

            {/* Restricted banner */}
            <div className="as-badge-active d-flex align-items-center gap-3 p-3 mb-4 rounded border-opacity-50">
              <i className="bi bi-shield-exclamation fs-4"></i>
              <p className="m-0 fs-7 opacity-75">
                This area is restricted to authorized administrators only.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} noValidate>
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
                    className={`form-control auth-input-field ${getFieldError('email') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                    placeholder="admin@example.com"
                  />
                </div>
                {getFieldError('email') && <p className="auth-error-text"><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.email}</p>}
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-lock auth-input-icon"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formik.values.password}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    className={`form-control auth-input-field ${getFieldError('password') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                    placeholder="Enter admin password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-pass-toggle">
                    <i className={showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                  </button>
                </div>
                {getFieldError('password') && <p className="auth-error-text"><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.password}</p>}
              </div>

              {/* Submit */}
              {error && (
                <div className="auth-api-error-box">
                  <p className="auth-error-text m-0">
                    <i className="bi bi-exclamation-circle me-2"></i>{error}
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="btn w-100 py-3 auth-submit-btn"
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
                  : <><i className="bi bi-shield-lock me-2"></i>Login as Admin</>
                }
              </button>
            </form>

            <div className="text-center mt-3">
              <Link to="/login" className="as-text-soft text-decoration-none fs-7">
                ← Back to Farmer Login
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

export default AdminLogin
