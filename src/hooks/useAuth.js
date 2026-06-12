import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { jwtDecode } from 'jwt-decode'

const cookies = new Cookies()

// roles: 'farmer' | 'admin' | 'super_admin' | ['admin', 'super_admin']
const useProtectedRoute = (allowedRoles) => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = cookies.get('agrosense_token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const decoded = jwtDecode(token)

      // check expiry
      if (decoded.exp * 1000 < Date.now()) {
        cookies.remove('agrosense_token', { path: '/' })
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
        return
      }

      // check role
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
      if (!roles.includes(decoded.role)) {
        // wrong role — redirect appropriately
        if (decoded.role === 'farmer') {
          navigate('/dashboard/overview', { replace: true })
        } else {
          navigate('/admin/overview', { replace: true })
        }
      }

    } catch {
      cookies.remove('agrosense_token', { path: '/' })
      navigate('/login', { replace: true })
    }
  }, [])
}

export default useProtectedRoute