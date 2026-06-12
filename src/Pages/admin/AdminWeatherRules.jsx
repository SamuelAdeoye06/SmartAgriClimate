import React, { useState, useEffect } from 'react'
import { useAdmin } from '../../context/DashboardContext'
import './AdminWeatherRules.css'

const ACTIVITY_FIELDS = {
    planting: {
        label: "🌱 Planting",
        desc:  "Conditions required for a good planting day",
        color: "#52b788",
        fields: [
            { key: "minRain",     label: "Min Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Minimum rain probability for good planting" },
            { key: "maxRain",     label: "Max Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Rain above this causes seed washout and waterlogging" },
            { key: "minHumidity", label: "Min Humidity",      unit: "%",    min: 0,  max: 100, desc: "Minimum humidity level required" },
            { key: "maxWind",     label: "Max Wind Speed",    unit: " km/h",min: 0,  max: 60,  desc: "Wind above this is too strong for planting" },
            { key: "minTemp",     label: "Min Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "Too cold below this temperature" },
            { key: "maxTemp",     label: "Max Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "Too hot above this temperature" },
        ]
    },
    harvesting: {
        label: "🌾 Harvesting",
        desc:  "Conditions required for safe harvesting",
        color: "#f4a261",
        fields: [
            { key: "maxRain", label: "Max Rain Chance", unit: "%",    min: 0, max: 100, desc: "Rain above this damages harvested produce" },
            { key: "maxWind", label: "Max Wind Speed",  unit: " km/h",min: 0, max: 60,  desc: "Wind above this risks produce damage" },
            { key: "minTemp", label: "Min Temperature", unit: "°C",   min: 0, max: 50,  desc: "Too cold for comfortable harvesting" },
            { key: "maxTemp", label: "Max Temperature", unit: "°C",   min: 0, max: 50,  desc: "Too hot for safe outdoor harvesting" },
        ]
    },
    spraying: {
        label: "🧪 Spraying",
        desc:  "Conditions for safe pesticide and fertilizer application",
        color: "#4db6e4",
        fields: [
            { key: "maxRain", label: "Max Rain Chance", unit: "%",    min: 0, max: 100, desc: "Rain washes away chemicals — keep this low" },
            { key: "maxWind", label: "Max Wind Speed",  unit: " km/h",min: 0, max: 60,  desc: "Wind causes dangerous chemical drift" },
            { key: "maxTemp", label: "Max Temperature", unit: "°C",   min: 0, max: 50,  desc: "High heat increases chemical evaporation risk" },
        ]
    },
    irrigation: {
        label: "💧 Irrigation",
        desc:  "When irrigation is recommended",
        color: "#74c69d",
        fields: [
            { key: "maxRain", label: "Max Rain Chance", unit: "%",    min: 0, max: 100, desc: "No need to irrigate if rain is likely" },
            { key: "minTemp", label: "Min Temperature", unit: "°C",   min: 0, max: 50,  desc: "Irrigation is most needed in high heat" },
        ]
    },
    weeding: {
        label: "🌿 Weeding",
        desc:  "Conditions for manual or mechanical weeding",
        color: "#83c5be",
        fields: [
            { key: "minRain",     label: "Min Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Usually best with 0% rain" },
            { key: "maxRain",     label: "Max Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Rain above this muds soil and causes weed re-rooting" },
            { key: "minHumidity", label: "Min Humidity",      unit: "%",    min: 0,  max: 100, desc: "Minimum humidity for field labor comfort" },
            { key: "maxWind",     label: "Max Wind Speed",    unit: " km/h",min: 0,  max: 60,  desc: "Strong winds make field labor difficult" },
            { key: "minTemp",     label: "Min Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "Too cold to weed comfortably" },
            { key: "maxTemp",     label: "Max Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "Too hot for manual field labor" },
        ]
    },
    tillage: {
        label: "🚜 Land Prep / Tillage",
        desc:  "Conditions for aerating soil and preparing beds/ridges",
        color: "#c18c5d",
        fields: [
            { key: "minRain",     label: "Min Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Soil needs slight moisture to loosen" },
            { key: "maxRain",     label: "Max Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Excessive rain creates heavy mud that ruins structure" },
            { key: "minHumidity", label: "Min Humidity",      unit: "%",    min: 0,  max: 100, desc: "Minimum humidity for tilling conditions" },
            { key: "maxWind",     label: "Max Wind Speed",    unit: " km/h",min: 0,  max: 60,  desc: "Strong winds cause soil erosion during tillage" },
            { key: "minTemp",     label: "Min Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "Too cold for soil manipulation" },
            { key: "maxTemp",     label: "Max Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "Too hot for strenuous manual tillage" },
        ]
    },
    fertilizing: {
        label: "🪱 Fertilizing",
        desc:  "Granular or compost fertilizer application conditions",
        color: "#b5e2fa",
        fields: [
            { key: "minRain",     label: "Min Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Needs very light moisture to dissolve granules" },
            { key: "maxRain",     label: "Max Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Rain above this washes fertilizer away into gutters" },
            { key: "minHumidity", label: "Min Humidity",      unit: "%",    min: 0,  max: 100, desc: "Ideal humidity level for application" },
            { key: "maxWind",     label: "Max Wind Speed",    unit: " km/h",min: 0,  max: 60,  desc: "High wind blows dry granules off target" },
            { key: "minTemp",     label: "Min Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "Minimum temperature for absorption" },
            { key: "maxTemp",     label: "Max Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "High temp increases burn risk under solar glare" },
        ]
    },
    pruning: {
        label: "✂️ Pruning / Thinning",
        desc:  "Trimming leaves and cutting branches or weeding excess shoots",
        color: "#ffc2d1",
        fields: [
            { key: "minRain",     label: "Min Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Always best with 0% rain to heal cuts" },
            { key: "maxRain",     label: "Max Rain Chance",   unit: "%",    min: 0,  max: 100, desc: "Rain keeps cuts wet, causing severe fungal infections" },
            { key: "maxWind",     label: "Max Wind Speed",    unit: " km/h",min: 0,  max: 60,  desc: "Strong winds whip freshly cut branches" },
            { key: "minTemp",     label: "Min Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "Cold temperatures delay healing of pruning cuts" },
            { key: "maxTemp",     label: "Max Temperature",   unit: "°C",   min: 0,  max: 50,  desc: "High temperatures cause excessive transpiration stress" },
        ]
    }
}

const DEFAULT_RULES = {
    planting:   { minRain: 40, maxRain: 50, minHumidity: 50, maxWind: 25, minTemp: 18, maxTemp: 35 },
    harvesting: { maxRain: 20, maxWind: 20, minTemp: 18, maxTemp: 38 },
    spraying:   { maxRain: 10, maxWind: 20, maxTemp: 35 },
    irrigation: { maxRain: 30, minTemp: 28 },
    weeding:    { minRain: 0,  maxRain: 30, minHumidity: 30, maxWind: 35, minTemp: 15, maxTemp: 35 },
    tillage:    { minRain: 10, maxRain: 40, minHumidity: 30, maxWind: 40, minTemp: 15, maxTemp: 36 },
    fertilizing:{ minRain: 5,  maxRain: 30, minHumidity: 30, maxWind: 20, minTemp: 15, maxTemp: 35 },
    pruning:    { minRain: 0,  maxRain: 15, minHumidity: 0,  maxWind: 30, minTemp: 15, maxTemp: 36 },
    alertRainThreshold: 85,
    alertWindThreshold: 40,
    alertTempHighThreshold: 38
}

const AdminWeatherRules = () => {
    const { rules, rulesLoading, rulesError, saveRules, resetRules } = useAdmin()

    const [local, setLocal]       = useState(DEFAULT_RULES)
    const [saving, setSaving]     = useState(false)
    const [resetting, setResetting] = useState(false)
    const [success, setSuccess]   = useState(null)
    const [errors, setErrors]     = useState([])
    const [activeTab, setActiveTab] = useState('planting')

    // sync from DB when rules load
    useEffect(() => {
        if (rules) setLocal(rules)
    }, [rules])

    const setActivityField = (activity, key, value) => {
        setLocal(prev => ({
            ...prev,
            [activity]: { ...prev[activity], [key]: Number(value) }
        }))
        setErrors([])
    }

    const setAlertField = (key, value) => {
        setLocal(prev => ({ ...prev, [key]: Number(value) }))
        setErrors([])
    }

    const handleSave = async () => {
        setSaving(true)
        setErrors([])
        setSuccess(null)
        const result = await saveRules(local)
        if (result.success) {
            setSuccess("Weather rules saved successfully!")
            setTimeout(() => setSuccess(null), 3000)
        } else {
            setErrors(result.errors || [result.message])
        }
        setSaving(false)
    }

    const handleReset = async () => {
        setResetting(true)
        const result = await resetRules()
        if (result.success) {
            setLocal(result.rules || DEFAULT_RULES)
            setSuccess("Rules reset to defaults.")
            setTimeout(() => setSuccess(null), 3000)
        }
        setResetting(false)
    }

    if (rulesLoading) return (
        <div className="text-center py-5">
            <div className="spinner-border text-success" />
            <p className="as-text-soft mt-3">Loading weather rules...</p>
        </div>
    )

    const activityConfig = ACTIVITY_FIELDS[activeTab]

    return (
        <div className="weather-rules-container">
            <div className="as-section-header mb-2">
                <div className="as-header-line" />
                <h5 className="as-section-title">Weather Rules</h5>
            </div>
            <p className="weather-rules-subtitle">
                Set the weather thresholds for each farming activity. The decision engine uses these to tell farmers what they can do each day.
            </p>

            {/* error messages from validation */}
            {errors.length > 0 && (
                <div className="alert alert-danger mb-3">
                    <strong>Rule conflict detected:</strong>
                    <ul className="mb-0 mt-1">
                        {errors.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                </div>
            )}

            {success && (
                <div className="alert alert-success mb-3">
                    <i className="bi bi-check-circle me-2"></i>{success}
                </div>
            )}

            {/* activity tabs */}
            <div className="rules-tabs mb-4">
                {Object.entries(ACTIVITY_FIELDS).map(([key, cfg]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`rules-tab-btn ${activeTab === key ? 'rules-tab-btn-active' : ''}`}
                        style={activeTab === key ? { borderColor: cfg.color, color: cfg.color } : {}}
                    >
                        {cfg.label}
                    </button>
                ))}
            </div>

            {/* active activity sliders */}
            <div className="rules-card mb-4">
                <p className="rules-activity-desc">{activityConfig.desc}</p>
                {activityConfig.fields.map((field) => {
                    const val = local[activeTab]?.[field.key] ?? 0
                    return (
                        <div key={field.key} className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="field-label">{field.label}</label>
                                <span className="field-value-badge">{val}{field.unit}</span>
                            </div>
                            <p className="field-description">{field.desc}</p>
                            <input
                                type="range"
                                min={field.min}
                                max={field.max}
                                value={val}
                                onChange={(e) => setActivityField(activeTab, field.key, e.target.value)}
                                className="field-range-input"
                            />
                            <div className="d-flex justify-content-between range-labels">
                                <span>{field.min}{field.unit}</span>
                                <span>{field.max}{field.unit}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* alert thresholds */}
            <div className="rules-card mb-4">
                <h6 className="as-text-primary fw-bold mb-1">⚠️ Alert Thresholds</h6>
                <p className="field-description mb-3">
                    These trigger severe weather alerts on the farmer dashboard — separate from good/poor day logic.
                </p>
                {[
                    { key: "alertRainThreshold",     label: "Alert Rain Threshold",    unit: "%",    min: 0, max: 100, desc: "Rain above this triggers a flood alert" },
                    { key: "alertWindThreshold",     label: "Alert Wind Threshold",    unit: " km/h",min: 0, max: 120, desc: "Wind above this triggers a dangerous wind alert" },
                    { key: "alertTempHighThreshold", label: "Alert Temperature Threshold", unit: "°C", min: 0, max: 50, desc: "Heat above this triggers an extreme heat alert" },
                ].map((field) => {
                    const val = local[field.key] ?? 0
                    return (
                        <div key={field.key} className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="field-label">{field.label}</label>
                                <span className="field-value-badge">{val}{field.unit}</span>
                            </div>
                            <p className="field-description">{field.desc}</p>
                            <input
                                type="range" min={field.min} max={field.max} value={val}
                                onChange={(e) => setAlertField(field.key, e.target.value)}
                                className="field-range-input"
                            />
                            <div className="d-flex justify-content-between range-labels">
                                <span>{field.min}{field.unit}</span>
                                <span>{field.max}{field.unit}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* save + reset */}
            <div className="d-flex gap-3">
                <button onClick={handleSave} disabled={saving} className="as-btn as-btn-primary flex-grow-1 py-3">
                    {saving
                        ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                        : <><i className="bi bi-save me-2"></i>Save All Rules</>
                    }
                </button>
                <button onClick={handleReset} disabled={resetting} className="as-btn as-btn-outline py-3 px-4">
                    {resetting ? 'Resetting...' : 'Reset Defaults'}
                </button>
            </div>
        </div>
    )
}

export default AdminWeatherRules