import api from '../api/axios'

// farmer fetches 7-day forecast + decisions
export const getForecast = async () => {
    const response = await api.get('/weather/forecast')
    return response.data
}

// force refresh cache (called after farmer updates location)
export const refreshWeatherCache = async () => {
    const response = await api.post('/weather/refresh')
    return response.data
}

// fetch just today's alert for the dashboard alert card
export const getTodayAlert = async () => {
    const response = await api.get('/weather/today-alert')
    return response.data
}