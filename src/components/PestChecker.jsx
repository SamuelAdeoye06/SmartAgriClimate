import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFarmer } from '../context/DashboardContext'
import { identifyPest, getAIAdvice } from '../services/advisory.service'
import { Icon } from '../utils/iconMap'
import './PestChecker.css'

// ── Category metadata ──
const CATEGORY_META = {
    grains:     { icon: '🌾', name: 'Grains & Cereals'   },
    tubers:     { icon: '🥔', name: 'Tubers & Roots'     },
    legumes:    { icon: '🫘', name: 'Legumes & Pulses'   },
    vegetables: { icon: '🍅', name: 'Vegetables'          },
    plantains:  { icon: '🍌', name: 'Plantains & Bananas' },
    fruits:     { icon: '🍊', name: 'Fruits & Orchards'  },
    cash_crops: { icon: '🌴', name: 'Cash Crops'          },
    herbs:      { icon: '🌿', name: 'Herbs & Spices'     },
}

// ── Symptom pills — keys match actual DB symptom values ──
const SYMPTOMS = [
    { key: 'yellow_leaves',      icon: '🟡', label: 'Yellowing leaves'          },
    { key: 'wilting',            icon: '😔', label: 'Wilting / drooping'         },
    { key: 'holes_in_leaves',    icon: '🕳️', label: 'Holes in leaves'           },
    { key: 'white_patches',      icon: '⬜', label: 'Powdery white coating'      },
    { key: 'brown_spots',        icon: '🟫', label: 'Brown spots'               },
    { key: 'black_spots',        icon: '⚫', label: 'Black spots'               },
    { key: 'stunted_growth',     icon: '📉', label: 'Stunted growth'            },
    { key: 'rotting_roots',      icon: '🌿', label: 'Root rot'                  },
    { key: 'rotting_stems',      icon: '🪵', label: 'Rotting stem'              },
    { key: 'leaf_curling',       icon: '🍃', label: 'Leaf curl'                 },
    { key: 'sticky_residue',     icon: '💧', label: 'Sticky residue on leaves'  },
    { key: 'mosaic_pattern',     icon: '🔶', label: 'Mosaic / mottled pattern'  },
    { key: 'fruit_drop',         icon: '🍎', label: 'Fruit dropping early'      },
    { key: 'leaf_streaks',       icon: '🌾', label: 'Leaf streaks'              },
    { key: 'distorted_leaves',   icon: '🍂', label: 'Distorted leaves'          },
    { key: 'chewed_leaves',      icon: '🐛', label: 'Chewed leaves / worms'     },
    { key: 'frass_on_leaves',    icon: '🕳️', label: 'Frass on leaves'          },
    { key: 'holes_in_pods',      icon: '🫘', label: 'Holes in pods'             },
    { key: 'sudden_collapse',    icon: '💥', label: 'Sudden plant collapse'      },
    { key: 'purple_flowers',     icon: '🌸', label: 'Unusual purple flowers'    },
]

// ── Severity badge ──
const SeverityBadge = ({ severity }) => {
    const cls = severity === 'high' ? 'pc-severity-high'
              : severity === 'moderate' ? 'pc-severity-moderate'
              : 'pc-severity-low'
    return <span className={`pc-badge-severity ${cls}`}>{severity}</span>
}

// ── Single result card (collapsed by default) ──
const ResultCard = ({ result, index }) => {
    const [open, setOpen] = useState(false)
    const totalSymptoms   = result.symptoms?.length || 1
    const matchPct        = Math.min(100, Math.round((result.matchCount / totalSymptoms) * 100))

    return (
        <div className="pc-result-card">
            <div
                className={`pc-result-header ${open ? 'open' : ''}`}
                onClick={() => setOpen(o => !o)}
                role="button"
                aria-expanded={open}
            >
                <div className="d-flex align-items-center gap-2 flex-wrap min-vw-0">
                    <p className="pc-result-name">#{index + 1}. {result.name}</p>
                    <div className="pc-result-badges">
                        <span className={`pc-badge-type ${result.type === 'pest' ? 'pc-badge-pest' : 'pc-badge-disease'}`}>
                            {result.type}
                        </span>
                        <SeverityBadge severity={result.severity} />
                    </div>
                </div>
                <i className={`bi bi-chevron-down pc-result-chevron ${open ? 'open' : ''}`} />
            </div>

            {open && (
                <div className="pc-result-body">
                    {/* Description */}
                    {result.description && (
                        <div>
                            <div className="pc-result-section-label">
                                <i className="bi bi-info-circle" /> Description
                            </div>
                            <p className="pc-result-section-text">{result.description}</p>
                        </div>
                    )}

                    {/* Organic control */}
                    {result.organicControl && (
                        <div>
                            <div className="pc-result-section-label">
                                <i className="bi bi-leaf" /> Organic Control
                            </div>
                            <p className="pc-result-section-text">{result.organicControl}</p>
                        </div>
                    )}

                    {/* Chemical control */}
                    {result.chemicalControl && (
                        <div>
                            <div className="pc-result-section-label">
                                <i className="bi bi-capsule" /> Chemical Control
                            </div>
                            <p className="pc-result-section-text">{result.chemicalControl}</p>
                        </div>
                    )}

                    {/* Prevention */}
                    {result.prevention && (
                        <div>
                            <div className="pc-result-section-label">
                                <i className="bi bi-shield-check" /> Prevention
                            </div>
                            <p className="pc-result-section-text">{result.prevention}</p>
                        </div>
                    )}

                    {/* Match strength bar */}
                    <div className="pc-match-bar-wrap">
                        <div className="pc-match-bar-label">
                            Matched <strong>{result.matchCount}</strong> of <strong>{totalSymptoms}</strong> known symptoms
                        </div>
                        <div className="pc-match-bar-track">
                            <div className="pc-match-bar-fill" style={{ width: `${matchPct}%` }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── AI Advice block ──
const AIAdviceBlock = ({ cropCategory, symptoms, matches, farmerName, weatherSummary }) => {
    const [advice, setAdvice]     = useState(null)
    const [loading, setLoading]   = useState(false)
    const [fetched, setFetched]   = useState(false)

    const handleGetAdvice = async () => {
        setLoading(true)
        try {
            const res = await getAIAdvice({ cropCategory, symptoms, matches, weatherSummary, farmerName })
            setAdvice(res.data.advice)
        } catch (err) {
            setAdvice(
                err.response?.data?.advice ||
                'Unable to generate advice at this time. Please consult your local agricultural extension officer.'
            )
        } finally {
            setLoading(false)
            setFetched(true)
        }
    }

    return (
        <div className="pc-ai-card">
            <div className="pc-ai-card-header">
                <span className="pc-ai-card-title"><Icon name="ai" className="me-1" /> Advisory</span>
                {!fetched && (
                    <button
                        className="as-btn as-btn-primary"
                        style={{ fontSize: '0.82rem', padding: '0.4rem 1rem' }}
                        onClick={handleGetAdvice}
                        disabled={loading}
                    >
                        {loading
                            ? <><span className="spinner-border spinner-border-sm me-2" />Getting advice...</>
                            : <><i className="bi bi-stars me-1" />Get AI Advice</>
                        }
                    </button>
                )}
            </div>
            <div className="pc-ai-card-body">
                {!fetched && !loading && (
                    <p className="as-text-soft" style={{ fontSize: '0.85rem', margin: 0 }}>
                        Click above to generate an advisory note based on your identified pests and current weather conditions.
                    </p>
                )}
                {loading && (
                    <div className="pc-loading" style={{ padding: '1.5rem 0' }}>
                        <div className="spinner-border text-success spinner-border-sm" />
                        <span className="as-text-soft">Getting advice from AI...</span>
                    </div>
                )}
                {fetched && advice && (
                    <>
                        <div className="pc-ai-advice-box">{advice}</div>
                        <p className="pc-ai-disclaimer">
                            <i className="bi bi-info-circle me-1" />
                            AI-generated advice. Always verify with a certified agricultural extension officer.
                        </p>
                        <button
                            className="as-btn as-btn-outline mt-2"
                            style={{ fontSize: '0.8rem', padding: '0.35rem 0.9rem' }}
                            onClick={() => { setFetched(false); setAdvice(null) }}
                        >
                            <i className="bi bi-arrow-clockwise me-1" />Refresh
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════
// ── Main PestChecker Component ──
// ══════════════════════════════════════════════
const PestChecker = ({ cropProfiles = [] }) => {
    const { todayWeather } = useFarmer()

    const [step, setStep]             = useState(1)   // 1 | 2 | 3
    const [cropCategory, setCrop]     = useState('')
    const [selected, setSelected]     = useState([])  // selected symptom keys
    const [results, setResults]       = useState(null) // null = not yet fetched
    const [loading, setLoading]       = useState(false)
    const [error, setError]           = useState(null)

    // ── helpers ──
    const toggleSymptom = (key) =>
        setSelected(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        )

    const reset = () => {
        setStep(1); setCrop(''); setSelected([]); setResults(null); setError(null)
    }

    const handleCheck = async () => {
        setLoading(true)
        setError(null)
        setStep(3)
        try {
            const res = await identifyPest({ cropCategory, symptoms: selected })
            setResults(res.data.results || [])
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to identify pests. Please try again.')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    // Build weather summary string for AI advice
    const weatherSummary = todayWeather
        ? `Temperature: ${todayWeather.temp}°C, Humidity: ${todayWeather.humidity}%, Rain chance: ${todayWeather.rain}%`
        : 'Weather data unavailable'

    const categoryMeta = CATEGORY_META[cropCategory] || {}

    // ── No crop profiles ──
    if (cropProfiles.length === 0) {
        return (
            <div className="pc-empty-state">
                <div className="pc-empty-icon">🌱</div>
                <h6 className="as-text-primary fw-bold mb-2">No Crops Selected</h6>
                <p className="as-text-soft mb-4">
                    You need to add crop categories in Settings before using the Pest &amp; Disease Checker.
                </p>
                <Link to="/dashboard/settings" className="as-btn as-btn-primary px-4 py-2">
                    <i className="bi bi-gear me-2" />Go to Settings
                </Link>
            </div>
        )
    }

    return (
        <div>
            {/* ── Step indicator ── */}
            <div className="pc-steps">
                <div className={`pc-step-dot ${step === 1 ? 'active' : 'done'}`}>
                    {step > 1 ? <i className="bi bi-check" /> : '1'}
                </div>
                <div className={`pc-step-line ${step > 1 ? 'done' : ''}`} />
                <div className={`pc-step-dot ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>
                    {step > 2 ? <i className="bi bi-check" /> : '2'}
                </div>
                <div className={`pc-step-line ${step > 2 ? 'done' : ''}`} />
                <div className={`pc-step-dot ${step === 3 ? 'active' : ''}`}>3</div>
            </div>
            <div className="pc-step-labels">
                <span className={`pc-step-label ${step === 1 ? 'active' : ''}`}>Select Crop</span>
                <span className={`pc-step-label ${step === 2 ? 'active' : ''}`}>Symptoms</span>
                <span className={`pc-step-label ${step === 3 ? 'active' : ''}`}>Results</span>
            </div>

            {/* ══════ STEP 1 — Select Crop ══════ */}
            {step === 1 && (
                <div>
                    <p className="pc-section-title">Which crop category is affected?</p>
                    <p className="pc-section-sub">Select the crop type you want to check for pests or diseases.</p>
                    <select
                        id="pc-crop-select"
                        className="pc-select mb-3"
                        value={cropCategory}
                        onChange={e => setCrop(e.target.value)}
                    >
                        <option value="">— Choose a crop category —</option>
                        {cropProfiles.map(cat => {
                            const meta = CATEGORY_META[cat] || {}
                            return (
                                <option key={cat} value={cat}>
                                    {meta.icon || ''} {meta.name || cat}
                                </option>
                            )
                        })}
                    </select>
                    <div className="pc-btn-row">
                        <button
                            id="pc-next-step1"
                            className="pc-btn-next"
                            disabled={!cropCategory}
                            onClick={() => setStep(2)}
                        >
                            Next <i className="bi bi-arrow-right" />
                        </button>
                    </div>
                </div>
            )}

            {/* ══════ STEP 2 — Select Symptoms ══════ */}
            {step === 2 && (
                <div>
                    <p className="pc-section-title">
                        {categoryMeta.icon} What symptoms do you see?
                    </p>
                    <p className="pc-section-sub">
                        Select all symptoms visible on your <strong>{categoryMeta.name}</strong>.
                        Choose at least one to continue.
                    </p>
                    <div className="pc-pills-grid">
                        {SYMPTOMS.map(({ key, icon, label }) => (
                            <button
                                key={key}
                                id={`pc-symptom-${key}`}
                                className={`pc-pill ${selected.includes(key) ? 'selected' : ''}`}
                                onClick={() => toggleSymptom(key)}
                                type="button"
                            >
                                <span className="pc-pill-icon">{icon}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="pc-btn-row">
                        <button className="pc-btn-back" onClick={() => { setStep(1); setSelected([]) }}>
                            <i className="bi bi-arrow-left" /> Back
                        </button>
                        <button
                            id="pc-check-now"
                            className="pc-btn-next"
                            disabled={selected.length === 0}
                            onClick={handleCheck}
                        >
                            <i className="bi bi-search me-1" />Check Now
                        </button>
                    </div>
                </div>
            )}

            {/* ══════ STEP 3 — Results ══════ */}
            {step === 3 && (
                <div>
                    {/* ── Loading ── */}
                    {loading && (
                        <div className="pc-loading">
                            <div className="spinner-border text-success" role="status" />
                            <span>Analysing symptoms...</span>
                        </div>
                    )}

                    {/* ── Error ── */}
                    {!loading && error && (
                        <div className="alert alert-danger rounded-3 mb-3">{error}</div>
                    )}

                    {/* ── Results ── */}
                    {!loading && results !== null && (
                        <>
                            {results.length === 0 ? (
                                <div className="pc-no-results">
                                    <div className="pc-no-results-icon">🔍</div>
                                    <h6 className="as-text-primary fw-bold mb-2">No Matches Found</h6>
                                    <p className="as-text-soft mb-0" style={{ fontSize: '0.88rem' }}>
                                        No known pests or diseases matched your symptoms. Try selecting more symptoms
                                        or consult a local agricultural extension officer.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className="pc-results-summary">
                                        Found <strong>{results.length}</strong> possible issue(s) for{' '}
                                        <strong>{categoryMeta.icon} {categoryMeta.name}</strong>
                                    </p>

                                    {results.map((r, i) => (
                                        <ResultCard key={r._id || i} result={r} index={i} />
                                    ))}

                                    {/* AI advice */}
                                    <AIAdviceBlock
                                        cropCategory={cropCategory}
                                        symptoms={selected}
                                        matches={results}
                                        farmerName=""
                                        weatherSummary={weatherSummary}
                                    />
                                </>
                            )}

                            {/* Start over */}
                            <div className="pc-btn-row mt-3">
                                <button className="pc-btn-reset" onClick={reset}>
                                    <i className="bi bi-arrow-counterclockwise me-1" />Start Over
                                </button>
                                <button className="pc-btn-back" onClick={() => { setStep(2); setResults(null) }}>
                                    <i className="bi bi-arrow-left me-1" />Adjust Symptoms
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default PestChecker
