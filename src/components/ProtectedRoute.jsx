import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) return null // wait for session restore

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  if (!roles.includes(user.role)) {
    if (user.role === 'farmer') return <Navigate to="/dashboard/overview" replace />
    return <Navigate to="/admin/overview" replace />
  }

  return children
}

export default ProtectedRoute