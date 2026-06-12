import api from '../api/axios'

// any logged-in user reads current rules
export const getRules = async () => {
    const response = await api.get('/weather-rules')
    return response.data
}

// admin saves updated thresholds
export const saveRules = async (rulesData) => {
    const response = await api.put('/weather-rules', rulesData)
    return response.data
}

// super admin resets to defaults
export const resetRules = async () => {
    const response = await api.post('/weather-rules/reset')
    return response.data
}