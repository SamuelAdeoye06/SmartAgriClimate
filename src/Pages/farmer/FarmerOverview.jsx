import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFarmer } from '../../context/DashboardContext'
import './FarmerOverview.css'
import SaveDateModal from '../../components/SaveDateModal'
import { Icon } from '../../utils/iconMap'
import { timingLabel } from '../../utils/iconHelpers'
import { emojiFor, timingEmoji, weatherEmoji } from '../../utils/emojiMap'

const FarmerOverview = () => {
    const [modalDay, setModalDay] = useState(null)

    const {
         location, savedDates, deleteDate, isAlreadySaved, todayWeather, forecast, activeAlert, weatherLoading, weatherError, loadWeather, saveDate
    } = useFarmer()

    const navigate = useNavigate()

    // ── Loading state ──
    if (weatherLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" />
                <p className="as-text-soft mt-3">Fetching weather for {location || 'your farm'}...</p>
            </div>
        )
    }

    // ── Error state ──
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

    // ── No data yet ──
    if (!todayWeather) {
        return (
            <div className="text-center py-5">
                <div className="empty-state-icon"><Icon name="weather" /></div>
                <p className="as-text-soft mt-2">No weather data yet.</p>
                <button onClick={loadWeather} className="as-btn as-btn-primary mt-2">
                    Load Weather
                </button>
            </div>
        )
    }

    // ── Stat cards ──
    const statCards = [
        {
            icon:  'temperature',
            label: 'Temperature Now',
            value: `${todayWeather.temp}°C`,
            sub:   `Today's range: ${forecast[0]?.tempMin ?? '--'}°C – ${forecast[0]?.tempMax ?? '--'}°C`,
            color: '#ff8c42'
        },
        {
            icon:  'rain',
            label: 'Rain Chance',
            value: `${forecast[0]?.rain ?? 0}%`,
            sub:   forecast[0]?.rain > 60 ? 'Likely to rain today' : 'Low rain chance today',
            color: 'var(--as-primary-green)'
        },
        {
            icon:  'humidity',
            label: 'Humidity',
            value: `${todayWeather.humidity}%`,
            sub:   todayWeather.humidity > 70 ? 'High moisture levels' : 'Moderate humidity',
            color: '#4db6e4'
        },
        {
            icon:  activeAlert ? 'alert' : 'clear',
            label: 'Farm Alert',
            value: activeAlert ? 'Alert' : 'All Clear',
            sub:   activeAlert
                ? activeAlert.message.slice(0, 48) + '...'
                : 'No severe weather today',
            color: activeAlert ? '#f87171' : 'var(--as-primary-green)'
        },
    ]

    // preview of first 5 forecast days for the mini table
    const forecastPreview = forecast.slice(0, 5)

    return (
        <>
            {/* ── Section header ── */}
            <div className="as-section-header mb-3">
                <div className="as-header-line" />
                <h6 className="as-text-primary fw-bold m-0 stat-label-small">
                    Current Weather Forecast
                </h6>
                <span className="as-badge as-badge-active ms-2">{location}</span>
            </div>

            {/* ── 4 stat cards ── */}
            <div className="row g-3 mb-4">
                {statCards.map((stat) => (
                    <div className="col-6 col-lg-3" key={stat.label}>
                        <div className="as-card">
                            <div className="stat-icon-large">{emojiFor(stat.icon)}</div>
                            <div className="stat-value-large" style={{ color: stat.color }}>
                                {stat.value}
                            </div>
                            <div className="as-text-primary fw-bold mt-2 stat-label-small">
                                {stat.label}
                            </div>
                            <div className="as-text-soft stat-sub-text">{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Today's condition banner ── */}
            <div className="mb-4 p-4 d-flex flex-wrap align-items-center justify-content-between gap-3 weather-banner">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <p className="as-text-soft m-0 stat-label-small text-white opacity-75">
                            Today's Current Condition
                        </p>
                        {todayWeather.rainTiming && todayWeather.rainTiming !== 'none' && (
                            <span className="overview-timing-badge">
                                {timingEmoji(todayWeather.rainTiming)} {timingLabel(todayWeather.rainTiming)} Rain
                            </span>
                        )}
                    </div>
                    <h3 className="as-section-title text-white mb-1 weather-banner-title">
                        {weatherEmoji(todayWeather.icon)} {todayWeather.label || (todayWeather.isGoodDay ? 'Suitable' : 'Unsafe')} Conditions
                    </h3>
                    <p className="as-text-soft m-0 weather-banner-desc">
                        {todayWeather.recommendation}
                    </p>
                </div>
                <div className="text-center p-3 temp-badge-box">
                    <div className="as-section-title text-white temp-value-display">
                        {todayWeather.temp}°C
                    </div>
                    <div className="as-text-soft mt-1 stat-label-small text-white opacity-75">
                        {location}
                    </div>
                </div>
            </div>

            {/* ── Alert banner ── */}
            {activeAlert && (
                <div className="mb-4 p-3 rounded-3 d-flex align-items-start gap-3 alert-banner">
                    <span className="alert-banner-icon">
                        {emojiFor(activeAlert.type === 'flood' ? 'flood' : activeAlert.type === 'wind' ? 'wind' : 'temperature')}
                    </span>
                    <div>
                        <p className="fw-bold m-0 alert-banner-title d-flex align-items-center gap-2">
                            {activeAlert.severity === 'high' ? 'Severe Weather Alert' : 'Weather Warning'}
                            {activeAlert.timing === 'night' && (
                                <span className="overnight-badge">🌙 Overnight Alert</span>
                            )}
                        </p>
                        <p className="m-0 alert-banner-message">{activeAlert.message}</p>
                    </div>
                </div>
            )}

            <div className="row g-3">
                {/* ── 7-day forecast mini table ── */}
                <div className="col-12 col-lg-7">
                    <div className="as-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="as-text-primary fw-bold m-0">7-Day Forecast</h6>
                            <button
                                onClick={() => navigate('../forecast')}
                                className="as-btn as-btn-outline border-0 p-0 stat-label-small"
                            >
                                View all <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>

                        {forecastPreview.length === 0 ? (
                            <p className="as-text-soft text-center py-3 m-0">No forecast data available.</p>
                        ) : (
                            <div className="fp-table">

                                {/* ── Header row ── */}
                                <div className="fp-table-header">
                                    <div className="fp-col-day">Day</div>
                                    <div className="fp-col-temp">Temp</div>
                                    <div className="fp-col-rain">Rain</div>
                                    <div className="fp-col-activities">Activities</div>
                                    <div className="fp-col-status">Status</div>
                                    <div className="fp-col-action"></div>
                                </div>

                                {/* ── Data rows ── */}
                                {forecastPreview.map((day) => (
                                    <div
                                        key={day.date}
                                        className={`fp-table-row fp-row-${(day.label || 'unsafe').toLowerCase()}`}
                                    >
                                        {/* Day */}
                                        <div className="fp-col-day">
                                            <span className="fp-weather-icon">{weatherEmoji(day.icon)}</span>
                                            <div>
                                                <div className="fp-day-name">{day.dayShort}</div>
                                                <div className="fp-day-date">{day.date?.slice(5)}</div>
                                            </div>
                                        </div>

                                        {/* Temp */}
                                        <div className="fp-col-temp">
                                            <span className="fp-temp-value">{day.temp}°C</span>
                                            <span className="fp-temp-range">{day.tempMin}°–{day.tempMax}°</span>
                                        </div>

                                        {/* Rain */}
                                        <div className="fp-col-rain">
                                            <span className="fp-rain-value">{day.rain}%</span>
                                            {day.rainTiming && day.rainTiming !== 'none' && (
                                                <span className="fp-timing-tag">
                                                    {timingEmoji(day.rainTiming)} {day.rainTiming === 'morning' ? 'Morn' : day.rainTiming === 'afternoon' ? 'Aft' : timingLabel(day.rainTiming)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Activities */}
                                        <div className="fp-col-activities">
                                            {day.recommendedActivities?.length > 0 ? (
                                                <div className="fp-activity-pills">
                                                    {day.recommendedActivities.slice(0, 2).map((act) => (
                                                        <span key={act.key} className="fp-activity-pill" title={act.label}>
                                                            {emojiFor(act.key || act.icon)} {act.label}
                                                        </span>
                                                    ))}
                                                    {day.recommendedActivities.length > 2 && (
                                                        <span className="fp-activity-pill fp-pill-more">
                                                            +{day.recommendedActivities.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="fp-no-activity">—</span>
                                            )}
                                        </div>

                                        {/* Status — hidden on mobile via CSS, left border communicates it instead */}
                                        <div className="fp-col-status">
                                            <span className={`fp-status-badge fp-status-${(day.label || 'unsafe').toLowerCase()}`}>
                                                {day.label || (day.isGoodDay ? 'Suitable' : 'Unsafe')}
                                            </span>
                                        </div>

                                        {/* Save */}
                                        <div className="fp-col-action">
                                            <button
                                                onClick={() => { if (!isAlreadySaved(day.date)) setModalDay(day) }}
                                                disabled={isAlreadySaved(day.date)}
                                                className={`fp-save-btn ${isAlreadySaved(day.date) ? 'fp-save-btn-saved' : 'fp-save-btn-active'}`}
                                            >
                                                {isAlreadySaved(day.date)
                                                    ? <><i className="bi bi-check-lg"></i> Saved</>
                                                    : 'Save'
                                                }
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Saved dates preview ── */}
                <div className="col-12 col-lg-5">
                    <div className="as-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="as-text-primary fw-bold m-0">
                                Saved Dates
                                {savedDates.length > 0 && (
                                    <span className="as-badge as-badge-active ms-2">
                                        {savedDates.length}
                                    </span>
                                )}
                            </h6>
                            <button
                                onClick={() => navigate('../saved')}
                                className="as-btn as-btn-outline border-0 p-0 stat-label-small"
                            >
                                View all <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>

                        {savedDates.length === 0 ? (
                            <div className="text-center py-4">
                                <div className="empty-state-icon">📅</div>
                                <p className="as-text-soft m-0 empty-state-text">
                                    No saved dates yet.<br />Save a good farming day!
                                </p>
                            </div>
                        ) : (
                            savedDates.slice(0, 3).map((d) => (
                                <div key={d._id} className="d-flex align-items-start justify-content-between py-2 border-bottom gap-2 forecast-item">
                                    <div className="overflow-hidden">
                                        <div className="as-text-primary fw-bold saved-preview-title">
                                            {weatherEmoji(d.weatherSnapshot?.icon, '📅')} {d.dayLabel} - {d.date}
                                        </div>
                                        {d.cropName && (
                                            <div className="as-text-soft saved-preview-sub">🌱 {d.cropName}</div>
                                        )}
                                        {d.note && (
                                            <div className="as-text-soft text-truncate saved-preview-note">📝 {d.note}</div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteDate(d._id)}
                                        className="as-btn as-btn-danger border-0 p-1 flex-shrink-0 saved-preview-delete"
                                    >
                                        <i className="bi bi-trash3"></i>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
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

export default FarmerOverview
