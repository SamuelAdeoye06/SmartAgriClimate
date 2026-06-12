import api from '../api/axios'

// farmer saves a good farming day
export const saveDate = async (dateData) => {
    const response = await api.post('/saved-dates', dateData)
    return response.data
}

// farmer fetches all their saved dates
export const getSavedDates = async () => {
    const response = await api.get('/saved-dates')
    return response.data
}

// farmer deletes a saved date
export const deleteDate = async (id) => {
    const response = await api.delete(`/saved-dates/${id}`)
    return response.data
}

// farmer updates note on a saved date
export const updateNote = async (id, note) => {
    const response = await api.patch(`/saved-dates/${id}/note`, { note })
    return response.data
}

// admin fetches total saved dates count + per-farmer breakdown
export const getAdminSavedDatesCount = async () => {
    const response = await api.get('/saved-dates/admin/count')
    return response.data
}