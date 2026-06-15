import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFarmer } from '../../context/DashboardContext'
import { getCropAdvisories } from '../../services/advisory.service'
import PestChecker from '../../components/PestChecker'
import { emojiFor } from '../../utils/emojiMap'
import './FarmerCrops.css'

// ── Per-field config: icon + label ──
const FIELD_CONFIG = [
    { key: 'plantingSeason', icon: 'bi-geo-alt',   label: 'Planting Season'  },
    { key: 'soilPrep',       icon: 'bi-tree',       label: 'Soil Preparation' },
    { key: 'spacing',        icon: 'bi-rulers',     label: 'Spacing'          },
    { key: 'watering',       icon: 'bi-droplet',    label: 'Watering'         },
    { key: 'fertilizer',     icon: 'bi-flask',      label: 'Fertilizer'       },
    { key: 'harvestSigns',   icon: 'bi-scissors',   label: 'Harvest Signs'    },
    { key: 'storage',        icon: 'bi-box-seam',   label: 'Storage'          },
]

// ── Single Advisory Card ──
const AdvisoryCard = ({ advisory, showPestBanner }) => {
    const [open, setOpen] = useState(true)

    return (
        <div className="advisory-card">
            {/* Header */}
            <div className="advisory-card-header" onClick={() => setOpen(o => !o)} role="button" aria-expanded={open}>
                <div className="advisory-card-title-row">
                    <span className="advisory-card-emoji">{emojiFor(advisory.category || advisory.icon || 'planting')}</span>
                    <div className="min-vw-0">
                        <p className="advisory-card-name">{advisory.name}</p>
                        {advisory.examples && (
                            <p className="advisory-card-examples">{advisory.examples}</p>
                        )}
                    </div>
                </div>
                <i className={`bi bi-chevron-down advisory-toggle-icon ${open ? 'open' : ''}`} />
            </div>

            {/* Body */}
            {open && (
                <div className="advisory-card-body">
                    {/* Weather pest-risk banner */}
                    {showPestBanner && (
                        <div className="pest-risk-banner">
                            <i className="bi bi-exclamation-triangle-fill" />
                            <span>
                                Current weather conditions may increase pest pressure for this crop.
                                Check the <strong>Pest &amp; Disease Checker</strong> tab.
                            </span>
                        </div>
                    )}

                    {/* Info grid */}
                    <div className="advisory-info-grid">
                        {FIELD_CONFIG.map(({ key, icon, label }) =>
                            advisory[key] ? (
                                <div className="advisory-info-item" key={key}>
                                    <span className="advisory-info-label">
                                        <i className={`bi ${icon}`} />
                                        {label}
                                    </span>
                                    <span className="advisory-info-value">{advisory[key]}</span>
                                </div>
                            ) : null
                        )}
                    </div>

                    {/* Common pests */}
                    {advisory.commonPests?.length > 0 && (
                        <div className="advisory-pests-row">
                            <span className="advisory-info-label mb-2 d-block">
                                <i className="bi bi-bug" />
                                Common Pests &amp; Diseases
                            </span>
                            {advisory.commonPests.map(pest => (
                                <span key={pest} className="advisory-pest-badge">
                                    <i className="bi bi-bug-fill" style={{ fontSize: '0.7rem' }} />
                                    {pest}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ── Main Page ──
const FarmerCrops = () => {
    const { user }                          = useAuth()
    const { todayWeather }                  = useFarmer()

    const [activeTab, setActiveTab]         = useState('guide')
    const [advisories, setAdvisories]       = useState([])
    const [loading, setLoading]             = useState(true)
    const [error, setError]                 = useState(null)

    // Determine if weather conditions elevate pest risk
    const hasPestRiskWeather = todayWeather
        ? (todayWeather.humidity > 75 || todayWeather.temp > 35)
        : false

    useEffect(() => {
        const fetchAdvisories = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await getCropAdvisories()
                setAdvisories(res.data.advisories || [])
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load crop advisories.')
            } finally {
                setLoading(false)
            }
        }
        fetchAdvisories()
    }, [])

    // Filter advisories to only the farmer's registered crop categories
    const cropProfiles   = user?.cropProfiles || []
    const hasCropProfile = cropProfiles.length > 0

    const filteredAdvisories = hasCropProfile
        ? advisories.filter(a => cropProfiles.includes(a.category))
        : []

    return (
        <>
            {/* ── Page Header ── */}
            <div className="crops-page-header">
                <div className="as-section-header">
                    <div className="as-header-line" />
                    <h5 className="as-section-title">Crop Guide &amp; Pest Checker</h5>
                </div>
            </div>

            {/* ── Tab Bar ── */}
            <div className="crops-tab-bar">
                <button
                    id="crops-tab-guide"
                    className={`crops-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
                    onClick={() => setActiveTab('guide')}
                >
                    <i className="bi bi-journal-richtext" />
                    Crop Guide
                </button>
                <button
                    id="crops-tab-checker"
                    className={`crops-tab-btn ${activeTab === 'checker' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checker')}
                >
                    <i className="bi bi-bug" />
                    Pest &amp; Disease Checker
                </button>
            </div>

            {/* ══════════════ CROP GUIDE TAB ══════════════ */}
            {activeTab === 'guide' && (
                <>
                    {loading ? (
                        <div className="crops-loading">
                            <div className="spinner-border text-success" role="status" />
                            <p className="as-text-soft mb-0">Loading crop advisories...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger rounded-3">{error}</div>
                    ) : !hasCropProfile ? (
                        /* ── Empty state — no crops registered ── */
                        <div className="crops-empty-card">
                            <div className="crops-empty-icon">🌱</div>
                            <h6 className="as-text-primary fw-bold mb-2">
                                No Crops Selected Yet
                            </h6>
                            <p className="as-text-soft mb-4">
                                You haven't selected any crop categories yet. Add your crops
                                in Settings to see personalised advisory guides.
                            </p>
                            <Link to="/dashboard/settings" className="as-btn as-btn-primary px-4 py-2">
                                <i className="bi bi-gear me-2" />
                                Go to Settings
                            </Link>
                        </div>
                    ) : filteredAdvisories.length === 0 ? (
                        /* ── No matching advisories in DB ── */
                        <div className="crops-empty-card">
                            <div className="crops-empty-icon">📋</div>
                            <h6 className="as-text-primary fw-bold mb-2">
                                Advisory data not available yet
                            </h6>
                            <p className="as-text-soft mb-0">
                                We are still building out advisory content for your crop categories.
                                Check back soon.
                            </p>
                        </div>
                    ) : (
                        /* ── Advisory Cards ── */
                        filteredAdvisories.map(advisory => (
                            <AdvisoryCard
                                key={advisory._id}
                                advisory={advisory}
                                showPestBanner={hasPestRiskWeather}
                            />
                        ))
                    )}
                </>
            )}

            {/* ══════════════ PEST CHECKER TAB ══════════════ */}
            {activeTab === 'checker' && (
                <PestChecker cropProfiles={user?.cropProfiles || []} />
            )}
        </>
    )
}

export default FarmerCrops
