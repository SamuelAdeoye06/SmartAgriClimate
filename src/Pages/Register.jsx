import { useState } from 'react'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { useAuth } from '../context/AuthContext'
import LocationSelector from '../components/LocationSelector'
import { STATES, getCities } from '../data/nigeriaLocations'
import './Login.css'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#])[A-Za-z\d@$!%*?&_#]{8,}$/

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

const registerSchema = Yup.object({
    fullName: Yup.string().trim().min(4, 'Name must be at least 4 characters').required('Full name is required'),
    email: Yup.string().trim().email('Enter a valid email address').required('Email is required'),
    cropProfiles: Yup.array().min(0),
    password: Yup.string()
        .matches(passwordRegex, 'Password must be at least 8 characters and include uppercase, lowercase, number and special character (@$!%*?&_#)')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords do not match')
        .required('Please confirm your password'),
})

const Register = () => {
    const { register, error, setError } = useAuth()
    const [loading, setLoading]           = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm]   = useState(false)
    const [cropOpen, setCropOpen]         = useState(false)

    // location state — managed separately from formik
    const [selectedState, setSelectedState] = useState('')
    const [selectedCity, setSelectedCity]   = useState('')
    const [stateError, setStateError]       = useState(null)
    const [cityError, setCityError]         = useState(null)

    const formik = useFormik({
        initialValues: {
            fullName: '', email: '',
            password: '', confirmPassword: '', cropProfiles: [],
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            // validate location fields before submitting
            let hasLocationError = false
            if (!selectedState) {
                setStateError('Please select your state')
                hasLocationError = true
            }
            if (!selectedCity) {
                setCityError('Please select your city or town')
                hasLocationError = true
            }
            if (hasLocationError) return

            setError(null)
            setLoading(true)

            try {
                // combine city and state into one clean string for the DB
                const farmLocation = `${selectedCity}, ${selectedState}`
                await register({
                    fullName:     values.fullName.trim(),
                    email:        values.email.trim(),
                    password:     values.password,
                    farmLocation,
                    cropProfiles: values.cropProfiles,
                })
            } catch {
                // error already set in AuthContext
            } finally {
                setLoading(false)
            }
        },
    })

    const handleFieldChange = (e) => {
        if (error) setError(null)
        formik.handleChange(e)
    }

    const handleStateChange = (state) => {
        setSelectedState(state)
        setSelectedCity('')
        setStateError(null)
        setCityError(null)
    }

    const handleCityChange = (city) => {
        setSelectedCity(city)
        setCityError(null)
    }

    const toggleCrop = (value) => {
        const current = formik.values.cropProfiles
        formik.setFieldValue(
            'cropProfiles',
            current.includes(value) ? current.filter(c => c !== value) : [...current, value]
        )
    }

    const getFieldError = (field) => formik.touched[field] && formik.errors[field]
    const passwordsMatch    = formik.touched.confirmPassword && formik.values.confirmPassword && formik.values.confirmPassword === formik.values.password
    const passwordsMismatch = getFieldError('confirmPassword')

    const selectedCropLabels = formik.values.cropProfiles
        .map(v => CROP_CATEGORIES.find(c => c.value === v)?.icon)
        .filter(Boolean)
        .join(' ')

    return (
        <div className="auth-page-container">

            {/* LEFT PANEL */}
            <div className="d-none d-lg-flex flex-column justify-content-between auth-left-panel">
                <div className="auth-circle-1" />
                <div className="auth-circle-2" />
                <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none position-relative z-1">
                    <div className="auth-logo-box"><i className="bi bi-cloud-sun-fill text-success"></i></div>
                    <span className="auth-logo-text">SmartAgriClimate</span>
                </Link>
                <div className="position-relative z-1">
                    <div className="auth-welcome-icon"><i className="bi bi-leaf-fill text-success fs-2"></i></div>
                    <h2 className="auth-welcome-title">
                        Start farming<br />
                        <span className="auth-welcome-accent">smarter today.</span>
                    </h2>
                    <p className="auth-welcome-desc">
                        Join farmers using SmartAgriClimate to plan better planting seasons with accurate weather forecasts.
                    </p>
                    <div className="mt-4 d-flex flex-column gap-3">
                        {[
                            '7-day weather forecasts for your farm',
                            'Smart advice for planting, harvesting and spraying',
                            'Save and plan your best farming dates',
                            'Update your farm location anytime',
                        ].map((item) => (
                            <div key={item} className="d-flex align-items-start gap-3">
                                <div className="auth-logo-box bg-opacity-25 border-opacity-50 mt-1" style={{ width: 24, height: 24 }}>
                                    <i className="bi bi-check fs-6 text-success"></i>
                                </div>
                                <span className="auth-quote-text italic-normal text-success opacity-75">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="position-relative z-1">
                    <p className="auth-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-quote-text fw-bold text-decoration-none">Sign in here</Link>
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="auth-right-panel">
                <div className="d-flex d-lg-none auth-mobile-header">
                    <i className="bi bi-cloud-sun-fill text-success fs-4 me-2"></i>
                    <span className="auth-logo-text">SmartAgriClimate</span>
                </div>

                <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
                    <div className="auth-form-wrapper">

                        <div className="mb-4">
                            <h3 className="auth-form-title">Create Account</h3>
                            <div className='d-flex justify-content-between'>
                                <p className="auth-form-subtitle">
                                    Already registered?{' '}
                                    <Link to="/login" className="as-text-accent fw-bold text-decoration-none">Sign in</Link>
                                </p>

                                <p className="auth-form-subtitle">
                                <Link to="/" className="as-text-accent text-decoration-none"><i class="bi bi-arrow-left"></i> Back to home</Link>
                                </p>
                            </div>
                        </div>

                        <form onSubmit={formik.handleSubmit} noValidate>

                            {/* Full Name */}
                            <div className="mb-3">
                                <label className="auth-label">Full Name</label>
                                <div className="auth-input-wrapper">
                                    <i className="bi bi-person auth-input-icon"></i>
                                    <input
                                        type="text" name="fullName"
                                        value={formik.values.fullName}
                                        onChange={handleFieldChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="e.g. Emeka Obi"
                                        className={`form-control auth-input-field ${getFieldError('fullName') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                                    />
                                </div>
                                {getFieldError('fullName') && (
                                    <p className="auth-error-text"><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.fullName}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="auth-label">Email Address</label>
                                <div className="auth-input-wrapper">
                                    <i className="bi bi-envelope auth-input-icon"></i>
                                    <input
                                        type="email" name="email"
                                        value={formik.values.email}
                                        onChange={handleFieldChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="you@example.com"
                                        className={`form-control auth-input-field ${getFieldError('email') ? 'auth-input-field-error' : 'auth-input-field-normal'}`}
                                    />
                                </div>
                                {getFieldError('email') && (
                                    <p className="auth-error-text"><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.email}</p>
                                )}
                            </div>

                            {/* Farm Location — two dropdowns */}
                            <div className="mb-3">
                                <label className="auth-label">
                                    Farm Location
                                    <span className="as-text-soft fw-normal ms-2" style={{ fontSize: '0.75rem' }}>
                                        (used to fetch your weather forecast)
                                    </span>
                                </label>
                                <LocationSelector
                                    selectedState={selectedState}
                                    selectedCity={selectedCity}
                                    onStateChange={handleStateChange}
                                    onCityChange={handleCityChange}
                                    states={STATES}
                                    getCities={getCities}
                                    stateError={stateError}
                                    cityError={cityError}
                                />
                                {selectedState && selectedCity && (
                                    <p className="auth-hint-text text-success mt-1">
                                        <i className="bi bi-check-circle me-1"></i>
                                        {selectedCity}, {selectedState}
                                    </p>
                                )}
                            </div>

                            {/* Crop Categories */}
                            <div className="mb-3">
                                <label className="auth-label">
                                    What do you grow?
                                    <span className="as-text-soft fw-normal ms-2" style={{ fontSize: '0.75rem' }}>(optional)</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setCropOpen(!cropOpen)}
                                    className={`crop-dropdown-trigger ${cropOpen ? 'crop-dropdown-trigger-open' : ''}`}
                                >
                                    <span className="crop-dropdown-value">
                                        {formik.values.cropProfiles.length === 0
                                            ? <span className="crop-dropdown-placeholder">Select crop categories...</span>
                                            : <span>{selectedCropLabels} — {formik.values.cropProfiles.length} selected</span>
                                        }
                                    </span>
                                    <i className={`bi bi-chevron-${cropOpen ? 'up' : 'down'} crop-dropdown-arrow`}></i>
                                </button>

                                {cropOpen && (
                                    <div className="crop-dropdown-panel">
                                        {CROP_CATEGORIES.map((cat) => {
                                            const selected = formik.values.cropProfiles.includes(cat.value)
                                            return (
                                                <button
                                                    key={cat.value}
                                                    type="button"
                                                    onClick={() => toggleCrop(cat.value)}
                                                    className={`crop-dropdown-item ${selected ? 'crop-dropdown-item-selected' : ''}`}
                                                >
                                                    <span className="crop-item-icon">{cat.icon}</span>
                                                    <div className="crop-item-text">
                                                        <div className="crop-item-label">{cat.label}</div>
                                                        <div className="crop-item-sub">{cat.sub}</div>
                                                    </div>
                                                    <i className={`bi ${selected ? 'bi-check-circle-fill' : 'bi-circle'} crop-item-check ${selected ? 'crop-item-check-active' : ''}`}></i>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
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
                                {getFieldError('password') ? (
                                    <p className="auth-error-text">
                                        <i className="bi bi-exclamation-circle me-1"></i>{formik.errors.password}
                                    </p>
                                ) : (
                                    <p className="auth-hint-text">
                                        Min 8 chars · uppercase · lowercase · number · special character (@$!%*?&_#)
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-3">
                                <label className="auth-label">Confirm Password</label>
                                <div className="auth-input-wrapper">
                                    <i className="bi bi-lock-fill auth-input-icon"></i>
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formik.values.confirmPassword}
                                        onChange={handleFieldChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Repeat your password"
                                        className={`form-control auth-input-field ${
                                            passwordsMismatch ? 'auth-input-field-error'
                                            : passwordsMatch  ? 'border-success'
                                            : 'auth-input-field-normal'
                                        }`}
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="auth-pass-toggle">
                                        <i className={showConfirm ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                                    </button>
                                </div>
                                {passwordsMismatch && (
                                    <p className="auth-error-text"><i className="bi bi-exclamation-circle me-1"></i>{formik.errors.confirmPassword}</p>
                                )}
                                {passwordsMatch && (
                                    <p className="auth-hint-text text-success"><i className="bi bi-check-circle me-1"></i>Passwords match</p>
                                )}
                            </div>

                            {error && (
                                <div className="auth-api-error-box">
                                    <p className="auth-error-text m-0"><i className="bi bi-exclamation-circle me-2"></i>{error}</p>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn w-100 py-3 auth-submit-btn" style={{ opacity: loading ? 0.7 : 1 }}>
                                {loading
                                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
                                    : <>Create My Account &nbsp;<i className="bi bi-arrow-right"></i></>
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

export default Register