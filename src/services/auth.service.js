import api from '../api/axios'

export const registerFarmer = async (formData) => {
  const response = await api.post('/auth/register', formData)
  return response.data
}

export const loginUser = async (formData) => {
  const response = await api.post('/auth/login', formData)
  return response.data
}

// farmer deletes self
export const deleteOwnAccount = async () => {
  const token = localStorage.getItem('token')

  const response = await api.delete('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

// admin/superadmin deletes farmer
export const adminDeleteFarmer = async (id) => {
  const token = localStorage.getItem('token')

  const response = await api.delete(`/auth/farmers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

// super admin deletes admin
export const superAdminDeleteAdmin = async (id) => {
  const token = localStorage.getItem('token')

  const response = await api.delete(`/auth/admin/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}