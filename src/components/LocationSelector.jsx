import React from 'react'

const LocationSelector = ({
    selectedState,
    selectedCity,
    onStateChange,
    onCityChange,
    states,
    getCities,
    stateError,
    cityError,
    disabled = false
}) => {
    const cities = selectedState ? getCities(selectedState) : []

    return (
        <div className="location-selector">
            {/* State dropdown */}
            <div className="mb-2">
                <label className="auth-label">State</label>
                <div className="location-select-wrapper">
                    <i className="bi bi-map location-select-icon"></i>
                    <select
                        value={selectedState}
                        onChange={(e) => {
                            onStateChange(e.target.value)
                            onCityChange('')   // reset city when state changes
                        }}
                        disabled={disabled}
                        className={`location-select ${stateError ? 'location-select-error' : selectedState ? 'location-select-valid' : ''}`}
                    >
                        <option value="">Select your state...</option>
                        {states.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <i className="bi bi-chevron-down location-select-chevron"></i>
                </div>
                {stateError && (
                    <p className="auth-error-text mt-1">
                        <i className="bi bi-exclamation-circle me-1"></i>{stateError}
                    </p>
                )}
            </div>

            {/* City dropdown — only enabled after state is chosen */}
            <div>
                <label className="auth-label">
                    City / Town
                    {!selectedState && (
                        <span className="as-text-soft fw-normal ms-2" style={{ fontSize: '0.75rem' }}>
                            (select a state first)
                        </span>
                    )}
                </label>
                <div className="location-select-wrapper">
                    <i className="bi bi-geo-alt location-select-icon"></i>
                    <select
                        value={selectedCity}
                        onChange={(e) => onCityChange(e.target.value)}
                        disabled={disabled || !selectedState}
                        className={`location-select ${cityError ? 'location-select-error' : selectedCity ? 'location-select-valid' : ''} ${!selectedState ? 'location-select-disabled' : ''}`}
                    >
                        <option value="">
                            {selectedState ? 'Select your city or town...' : 'Select state first'}
                        </option>
                        {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <i className="bi bi-chevron-down location-select-chevron"></i>
                </div>
                {cityError && (
                    <p className="auth-error-text mt-1">
                        <i className="bi bi-exclamation-circle me-1"></i>{cityError}
                    </p>
                )}
            </div>
        </div>
    )
}

export default LocationSelector