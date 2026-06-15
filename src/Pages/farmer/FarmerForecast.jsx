import { useState } from 'react'
import { useFarmer } from '../../context/DashboardContext'
import SaveDateModal from '../../components/SaveDateModal'
import './FarmerForecast.css'
import { Icon } from '../../utils/iconMap'
import { timingLabel } from '../../utils/iconHelpers'
import { emojiFor, timingEmoji, weatherEmoji } from '../../utils/emojiMap'

const FarmerForecast = () => {
    const {
        location,
        forecast,
        weatherLoading,
        weatherError,
        loadWeather,
        isAlreadySaved,
        saveDate
    } = useFarmer()

    const [modalDay, setModalDay] = useState(null)

    // ── Loading ──
    if (weatherLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" />
                <p className="as-text-soft mt-3">Loading 7-day forecast...</p>
            </div>
        )
    }

    // ── Error ──
    if (weatherError) {
        return (
            <div className="text-center py-5">
                <div className="empty-state-icon"><Icon name="alert" /></div>
                <p className="as-text-primary fw-bold mt-2">{weatherError}</p>
                <button onClick={loadWeather} className="as-btn as-btn-primary mt-2">
                    Try Again
                </button>
            </div>
        )
    }

    // ── No data ──
    if (!forecast || forecast.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="empty-state-icon"><Icon name="weather" /></div>
                <p className="as-text-soft mt-2">No forecast data available yet.</p>
                <button onClick={loadWeather} className="as-btn as-btn-primary mt-2">
                    Load Forecast
                </button>
            </div>
        )
    }

    return (
        <>
            {/* ── Header ── */}
            <div className="as-section-header mb-4">
                <div className="as-header-line" />
                <h5 className="as-section-title">7-Day Forecast</h5>
                <span className="forecast-location-meta ms-2">· {location}</span>
            </div>

            {/* ── Info banner ── */}
            <div className="forecast-info-banner">
                <span className="forecast-info-banner-icon"><Icon name="light" /></span>
                <div className="pe-3">
                    <h6 className="forecast-info-banner-title">Hourly Precision & Timing Profiles</h6>
                    <p className="forecast-info-banner-text">
                        <strong>Today & Tomorrow's</strong> forecasts are enhanced with real-time hourly analysis to pinpoint exact times of rain, wind, or high temperatures. Days 3–7 show generalised daily averages — timing profiles and suitability ratings automatically unlock once those days are within the 48-hour window.
                    </p>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>

            {/* ── Forecast cards ── */}
            <div className="row g-3">
                {forecast.map((day) => (
                    <div className="col-12 col-md-4" key={day.date}>
                        <div className={`forecast-card-detailed ${day.isGoodDay ? 'forecast-card-good' : 'forecast-card-poor'} ${
                            day.label === 'Optimal'    ? 'forecast-card-optimal'
                            : day.label === 'Suitable'   ? 'forecast-card-suitable'
                            : day.label === 'Restricted' ? 'forecast-card-restricted'
                            :                              'forecast-card-unsafe'
                        }`}>

                            {/* day name + suitability badge */}
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                <span className="forecast-day-label">{day.dayLabel}</span>
                                <span className={`forecast-suitability-badge ${
                                    day.label === 'Optimal'    ? 'suitability-badge-optimal'
                                    : day.label === 'Suitable'   ? 'suitability-badge-suitable'
                                    : day.label === 'Restricted' ? 'suitability-badge-restricted'
                                    :                              'suitability-badge-unsafe'
                                }`}>
                                    {day.label || (day.isGoodDay ? 'Suitable' : 'Unsafe')}
                                </span>
                            </div>

                            {/* icon + temp + range */}
                            <div className="forecast-icon-large">{weatherEmoji(day.icon)}</div>
                            <div className="forecast-temp-value">{day.temp}°C</div>
                            <div className="forecast-temp-range">
                                ↓ {day.tempMin}°C &nbsp;·&nbsp; ↑ {day.tempMax}°C
                            </div>

                            {day.description && (
                                <div className="forecast-description">{day.description}</div>
                            )}

                            {/* condition label */}
                            <div className={`forecast-condition-label mb-2 fw-bold ${
                                day.label === 'Optimal'    ? 'condition-label-optimal'
                                : day.label === 'Suitable'   ? 'condition-label-suitable'
                                : day.label === 'Restricted' ? 'condition-label-restricted'
                                :                              'condition-label-unsafe'
                            }`}>
                                {day.label || (day.isGoodDay ? 'Suitable Day' : 'Unsafe Day')}
                            </div>

                            {/* weather stats */}
                            <div className="forecast-stats-list">
                                {[
                                    { icon: 'bi-cloud-rain', label: 'Rain',     value: `${day.rain}%`,         color: 'var(--as-primary-green)', timing: day.rainTiming },
                                    { icon: 'bi-droplet',    label: 'Humidity', value: `${day.humidity}%`,      color: '#4db6e4',                 timing: null },
                                    { icon: 'bi-wind',       label: 'Wind',     value: `${day.windSpeed} km/h`, color: '#a78bfa',                 timing: day.windTiming },
                                ].map((s) => (
                                    <div key={s.label} className="forecast-stat-item py-1">
                                        <span className="forecast-stat-label">
                                            <i className={`bi ${s.icon} me-1`}></i>{s.label}
                                        </span>
                                        <div className="d-flex align-items-center gap-2">
                                            {s.timing && s.timing !== 'none' && (
                                                <span className="forecast-timing-badge">
                                                    {timingEmoji(s.timing)} {s.timing === 'morning' ? 'Morn' : s.timing === 'afternoon' ? 'Aft' : timingLabel(s.timing)}
                                                </span>
                                            )}
                                            <span className="forecast-stat-value" style={{ color: s.color }}>
                                                {s.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* recommendation */}
                            {day.recommendation && (
                                <p className="forecast-recommendation forecast-recommendation-text mt-2 mb-2">
                                    {day.recommendation}
                                </p>
                            )}

                            {/* activity matrix */}
                            <div className="forecast-activity-matrix">
                                <div className="as-text-soft forecast-activity-matrix-label">Recommended Activities</div>
                                <div className="d-flex flex-wrap gap-1">
                                    {day.recommendedActivities?.length > 0 ? (
                                        day.recommendedActivities.map((act) => (
                                            <span key={act.key} className="forecast-activity-chip" title={act.label}>
                                                <span>{emojiFor(act.key || act.icon)}</span>
                                                <span>{act.label}</span>
                                            </span>
                                        ))
                                    ) : (
                                        <span className="as-text-soft forecast-activity-empty">
                                            No activities recommended for today's weather.
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* crop tips */}
                            {day.categoryTips?.length > 0 && (
                                <div className="forecast-tips mt-1 mb-2">
                                    {day.categoryTips.slice(0, 2).map((tip, i) => (
                                        <div key={i} className="forecast-tip-item">
                                            {emojiFor(tip.icon)} <span>{tip.tip}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* save button */}
                            <button
                                onClick={() => !isAlreadySaved(day.date) && setModalDay(day)}
                                disabled={isAlreadySaved(day.date)}
                                className={`as-btn w-100 py-2 save-date-btn ${isAlreadySaved(day.date) ? 'save-date-btn-saved' : 'as-btn-primary'}`}
                            >
                                {isAlreadySaved(day.date)
                                    ? <><i className="bi bi-check-lg me-1"></i>Saved</>
                                    : <><i className="bi bi-calendar-plus me-1"></i>Save Date</>
                                }
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Save date modal ── */}
            {modalDay && (
                <SaveDateModal
                    day={modalDay}
                    onSave={saveDate}
                    onClose={() => setModalDay(null)}
                />
            )}
        </>
    )
}

export default FarmerForecast
