import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const apiBaseUrl = (import.meta.env.PROD
  ? import.meta.env.VITE_PROD_BASE_URL
  : import.meta.env.VITE_DEV_BASE_URL) || import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: `${apiBaseUrl?.replace(/\/$/, '')}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// attach token from cookie to every request
api.interceptors.request.use((config) => {
  const token = cookies.get('agrosense_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
