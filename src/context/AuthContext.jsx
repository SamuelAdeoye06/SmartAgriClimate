import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { jwtDecode } from 'jwt-decode'
import api from '../api/axios'

const cookies     = new Cookies()
const AuthContext  = createContext(null)
const COOKIE_NAME  = 'agrosense_token'
const USER_KEY     = 'agrosense_user'  // ← one consistent key throughout

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setError(null)
  }, [location.pathname])

  // on app load — restore session from cookie + localStorage
  useEffect(() => {
    const savedToken = cookies.get(COOKIE_NAME)
    const savedUser  = localStorage.getItem(USER_KEY)

    if (savedToken && savedUser) {
      try {
        const decoded   = jwtDecode(savedToken)
        const isExpired = decoded.exp * 1000 < Date.now()

        if (isExpired) {
          clearSession()
        } else {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        }
      } catch {
        clearSession()
      }
    }
    setLoading(false)
  }, [])

  const saveSession = (token, userData) => {
    const isAdmin = userData.role === 'admin' || userData.role === 'super_admin'
    cookies.set(COOKIE_NAME, token, {
      path: '/',
      ...(isAdmin ? {} : { maxAge: 60 * 60 * 24 * 7 })
    })
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(token)
    setUser(userData)
  }

  const clearSession = () => {
    cookies.remove(COOKIE_NAME, { path: '/' })
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  const register = async (formData) => {
    try {
      setError(null)
      const { data } = await api.post('/auth/register', formData)
      saveSession(data.token, data.user)   // correct
      navigate('/dashboard/overview')
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(message)
      throw new Error(message)
    }
  }

  const login = async (formData) => {
    try {
      setError(null)
      const { data } = await api.post('/auth/login', formData)
      saveSession(data.token, data.user)   // correct

      if (data.user.role === 'super_admin' || data.user.role === 'admin') {
        navigate('/admin/overview')
      } else {
        navigate('/dashboard/overview')
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.'
      setError(message)
      throw new Error(message)
    }
  }

  const logout = () => {
    clearSession()
    navigate('/login')
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))  // consistent key
  }

  const uploadAvatar = async (base64Image, isRetry = false) => {
    try {
      const { data } = await api.post('/auth/upload-avatar', { profileImage: base64Image })
      updateUser(data.user)
      return { success: true }
    } catch (err) {
      if (!isRetry) {
        console.warn('Avatar upload failed, retrying once...')
        await new Promise(resolve => setTimeout(resolve, 1500))
        return uploadAvatar(base64Image, true)
      }
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to upload image'
      }
    }
  }

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/me')
      clearSession()
      navigate('/login')
    } catch (err) {
      console.error('Failed to delete account:', err.message)
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading, error, setError,
      register, login, logout, updateUser, uploadAvatar, deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
