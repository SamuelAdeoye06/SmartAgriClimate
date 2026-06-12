import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
})

const Login = () => {
  const { login, error, setError } = useAuth()
  const [loading, setLoading]       = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setError(null)
      setLoading(true)
      try {
        await login({ email: values.email.trim(), password: values.password })
      } catch {
        // error is already set in AuthContext
      } finally {
        setLoading(false)
      }
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
          <span className="auth-logo-text">SmartAgriClimate</span>
        </Link>

        <div className="position-relative z-1">
          <div className="auth-welcome-icon"><i className="bi bi-brightness-high text-success fs-2"></i></div>
          <h2 className="auth-welcome-title">
            Welcome back,<br />
            <span className="auth-welcome-accent">Farmer.</span>
          </h2>
          <p className="auth-welcome-desc">
            Your farm data, saved dates, and weather forecasts are right where you left them.
          </p>
          <div className="d-flex gap-3">
            {[{ value: '7-Day', label: 'Forecast' }, { value: '100%', label: 'Free' }, { value: '5+', label: 'Weather Points' }].map((stat) => (
              <div key={stat.label} className="auth-stat-box">
                <div className="auth-stat-value">{stat.value}</div>
                <div className="auth-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-quote-box">
          <p className="auth-quote-text">
            "Good farming starts with knowing what the sky is planning."
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right-panel">

        <div className="d-flex d-lg-none auth-mobile-header">
          <i className="bi bi-cloud-sun-fill text-success fs-4 me-2"></i>
          <span className="auth-logo-text">SmartAgriClimate</span>
        </div>

        <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
          <div className="auth-form-wrapper">

            <div className="mb-4">
              <h3 className="auth-form-title">Sign In</h3>
              <div className='d-flex justify-content-between'>
                <p className="auth-form-subtitle">
                  Don't have an account?{' '}
                  <Link to="/register" className="as-text-accent fw-bold text-decoration-none">Create one free</Link>
                </p>

                <p className="auth-form-subtitle">
                  <Link to="/" className="as-text-accent text-decoration-none"><i class="bi bi-arrow-left"></i> Back to home</Link>
                </p>
              </div>

            </div>

            <form onSubmit={formik.handleSubmit} noValidate>

              {/* Email */}
              <div className="mb-3">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-envelope auth-input-icon"></i>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    placeholder="you@example.com"
                    className={`form-control auth-input-field ${getFieldError('email') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                  />
                </div>
                {getFieldError('email') && (
                  <p className="auth-error-text">
                    <i className="bi bi-exclamation-circle me-1"></i>{formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="auth-label m-0">Password</label>
                  <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
                </div>
                <div className="auth-input-wrapper">
                  <i className="bi bi-lock auth-input-icon"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formik.values.password}
                    onChange={handleFieldChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    className={`form-control auth-input-field ${getFieldError('password') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-pass-toggle">
                    <i className={showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                  </button>
                </div>
                {getFieldError('password') && (
                  <p className="auth-error-text">
                    <i className="bi bi-exclamation-circle me-1"></i>{formik.errors.password}
                  </p>
                )}
              </div>

              {/* API error */}
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
                  : <>Sign In &nbsp;<i className="bi bi-arrow-right"></i></>
                }
              </button>
            </form>
          </div>
        </div>

        <div className="text-center pb-4">
          <p className="auth-footer-text">© 2026 SmartAgriClimate. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Login