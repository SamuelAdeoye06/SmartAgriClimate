import api from '../api/axios'

// GET /api/advisory/crops  (optional ?category= filter)
export const getCropAdvisories = (category) => {
    const params = category ? { category } : {}
    return api.get('/advisory/crops', { params })
}

// GET /api/advisory/crops/:category
export const getCropByCategory = (category) => {
    return api.get(`/advisory/crops/${category}`)
}

// GET /api/advisory/pests  (optional ?category= and ?type= filters)
export const getPests = (cropCategory, type) => {
    const params = {}
    if (cropCategory) params.category = cropCategory
    if (type)         params.type     = type
    return api.get('/advisory/pests', { params })
}

// POST /api/advisory/identify
export const identifyPest = ({ cropCategory, symptoms }) => {
    return api.post('/advisory/identify', { cropCategory, symptoms })
}

// POST /api/advisory/ai-advice  (stub — returns fallback message)
export const getAIAdvice = ({ cropCategory, symptoms, matches, weatherSummary, farmerName }) => {
    return api.post('/advisory/ai-advice', { cropCategory, symptoms, matches, weatherSummary, farmerName })
}
