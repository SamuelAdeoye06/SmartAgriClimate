import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { getForecast }              from '../services/weather.service'
import { getSavedDates, saveDate as saveDateApi, deleteDate as deleteDateApi, updateNote as updateNoteApi, getAdminSavedDatesCount } from '../services/savedDates.service'
import { getRules, saveRules as saveRulesApi, resetRules as resetRulesApi } from '../services/weatherRules.service'

// ─────────────────────────────────────────────
// FARMER CONTEXT
// ─────────────────────────────────────────────
const FarmerContext = createContext(null)

export const FarmerProvider = ({ children }) => {
    const { user } = useAuth()

    // ── Farmer identity ──
    const [farmerName, setFarmerName] = useState('')
    const [location, setLocation]     = useState('')
    const [cropProfiles, setCropProfiles] = useState([])

    // ── Weather state ──
    const [weatherData, setWeatherData]       = useState(null)   // { current, forecast, location, fetchedAt }
    const [weatherLoading, setWeatherLoading] = useState(false)
    const [weatherError, setWeatherError]     = useState(null)

    // ── Saved dates state ──
    const [savedDates, setSavedDates]           = useState([])
    const [savedDatesLoading, setSavedDatesLoading] = useState(false)

    // sync farmer identity from auth user
    useEffect(() => {
        if (user) {
            setFarmerName(user.fullName || '')
            setLocation(user.farmLocation || '')
            setCropProfiles(user.cropProfiles || [])
        }
    }, [user])

    // load weather + saved dates when farmer logs in
    useEffect(() => {
        if (user && user.role === 'farmer') {
            loadWeather()
            loadSavedDates()
        }
    }, [user])

    // ── Weather ──
    const loadWeather = useCallback(async () => {
        try {
            setWeatherLoading(true)
            setWeatherError(null)
            const data = await getForecast()
            setWeatherData(data)
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to load weather data'
            setWeatherError(msg)
            console.error('Load weather error:', msg)
        } finally {
            setWeatherLoading(false)
        }
    }, [])

    // ── Saved Dates ──
    const loadSavedDates = useCallback(async () => {
        try {
            setSavedDatesLoading(true)
            const data = await getSavedDates()
            setSavedDates(data.dates || [])
        } catch (error) {
            console.error('Load saved dates error:', error.message)
        } finally {
            setSavedDatesLoading(false)
        }
    }, [])

    const saveDate = async (datePayload) => {
        try {
            const data = await saveDateApi(datePayload)
            // add the new saved date to local state immediately
            // so UI updates without a full reload
            setSavedDates((prev) => [...prev, data.savedDate])
            return { success: true }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to save date'
            return { success: false, message: msg }
        }
    }

    const deleteDate = async (id) => {
        try {
            await deleteDateApi(id)
            setSavedDates((prev) => prev.filter((d) => d._id !== id))
            return { success: true }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to delete date'
            return { success: false, message: msg }
        }
    }

    const updateNote = async (id, note) => {
        try {
            const data = await updateNoteApi(id, note)
            setSavedDates((prev) =>
                prev.map((d) => d._id === id ? { ...d, note: data.savedDate.note } : d)
            )
            return { success: true }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to update note'
            return { success: false, message: msg }
        }
    }

    const isAlreadySaved = (date) => savedDates.some((d) => d.date === date)

    // today's data — pulled from the first forecast entry or current
    const todayWeather  = weatherData?.current   || null
    const forecast      = weatherData?.forecast  || []

    // active alert — from today's decision engine output
    const activeAlert   = todayWeather?.alert    || null

    return (
        <FarmerContext.Provider value={{
            // identity
            farmerName, setFarmerName,
            location,   setLocation,
            cropProfiles, setCropProfiles,

            // weather
            weatherData, weatherLoading, weatherError,
            loadWeather,
            todayWeather, forecast, activeAlert,

            // saved dates
            savedDates, savedDatesLoading,
            saveDate, deleteDate, updateNote,
            isAlreadySaved, loadSavedDates
        }}>
            {children}
        </FarmerContext.Provider>
    )
}

export const useFarmer = () => useContext(FarmerContext)


// ─────────────────────────────────────────────
// ADMIN CONTEXT
// ─────────────────────────────────────────────
const AdminContext = createContext(null)

export const AdminProvider = ({ children }) => {
    const { user } = useAuth()

    // ── Farmers & Admins ──
    const [users, setUsers]                   = useState([])
    const [usersLoading, setUsersLoading]     = useState(false)
    const [admins, setAdmins]                 = useState([])
    const [adminsLoading, setAdminsLoading]   = useState(false)

    // ── Saved dates stats (for admin dashboard cards) ──
    const [totalSavedDates, setTotalSavedDates]   = useState(0)
    const [farmerCountMap, setFarmerCountMap]      = useState({})   // { farmerId: count }
    const [statsLoading, setStatsLoading]          = useState(false)

    // ── Weather rules ──
    const [rules, setRules]           = useState(null)
    const [rulesLoading, setRulesLoading] = useState(false)
    const [rulesError, setRulesError] = useState(null)

    const isSuperAdmin = user?.role === 'super_admin'
    const adminName    = user?.fullName || 'Admin'
    const adminEmail   = user?.email || ''

    // load everything when admin logs in
    useEffect(() => {
        if (user && (user.role === 'admin' || user.role === 'super_admin')) {
            loadFarmers()
            loadStats()
            loadRules()
            if (user.role === 'super_admin') loadAdmins()
        }
    }, [user])

    // ── Loaders ──
    const loadFarmers = async () => {
        try {
            setUsersLoading(true)
            const response = await import('../api/axios').then(m => m.default.get('/auth/admin/farmers'))
            const mapped = response.data.farmers.map((f) => ({
                id:        f._id,
                name:      f.fullName,
                email:     f.email,
                location:  f.farmLocation,
                status:    f.status,
                joined:    new Date(f.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                }),
                saved:     0,   // will be filled by farmerCountMap below
                avatarUrl: f.avatarUrl,
            }))
            setUsers(mapped)
        } catch (error) {
            console.error('Failed to load farmers:', error.message)
        } finally {
            setUsersLoading(false)
        }
    }

    const loadAdmins = async () => {
        try {
            setAdminsLoading(true)
            const response = await import('../api/axios').then(m => m.default.get('/auth/admin/admins'))
            const mapped = response.data.admins.map((a) => ({
                id:        a._id,
                name:      a.fullName,
                email:     a.email,
                role:      a.role,
                status:    a.status,
                joined:    new Date(a.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                }),
                avatarUrl: a.avatarUrl,
            }))
            setAdmins(mapped)
        } catch (error) {
            console.error('Failed to load admins:', error.message)
        } finally {
            setAdminsLoading(false)
        }
    }

    const loadStats = async () => {
        try {
            setStatsLoading(true)
            const data = await getAdminSavedDatesCount()
            setTotalSavedDates(data.total || 0)
            setFarmerCountMap(data.farmerCountMap || {})
        } catch (error) {
            console.error('Failed to load saved dates stats:', error.message)
        } finally {
            setStatsLoading(false)
        }
    }

    const loadRules = async () => {
        try {
            setRulesLoading(true)
            setRulesError(null)
            const data = await getRules()
            setRules(data.rules)
        } catch (error) {
            setRulesError('Failed to load weather rules')
            console.error('Load rules error:', error.message)
        } finally {
            setRulesLoading(false)
        }
    }

    // ── merge farmerCountMap into users so table shows real saved counts ──
    // runs whenever either users list or farmerCountMap updates
    const usersWithSavedCounts = users.map((u) => ({
        ...u,
        saved: farmerCountMap[u.id] || 0
    }))

    // ── Admin actions ──
    const createAdmin = async (adminData) => {
        try {
            const response = await import('../api/axios').then(m =>
                m.default.post('/auth/admin/register', adminData)
            )
            await loadAdmins()
            return { success: true, message: response.data.message }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create admin'
            }
        }
    }

    const deleteFarmer = async (id) => {
        try {
            await import('../api/axios').then(m => m.default.delete(`/auth/farmers/${id}`))
            setUsers((prev) => prev.filter((u) => u.id !== id))
        } catch (error) {
            console.error('Failed to delete farmer:', error.response?.data?.message || error.message)
        }
    }

    const deleteAdmin = async (id) => {
        try {
            await import('../api/axios').then(m => m.default.delete(`/auth/admin/${id}`))
            setAdmins((prev) => prev.filter((a) => a.id !== id))
        } catch (error) {
            console.error('Failed to delete admin:', error.response?.data?.message || error.message)
        }
    }

    const toggleFarmerStatus = async (id) => {
        try {
            const response = await import('../api/axios').then(m =>
                m.default.patch(`/auth/admin/farmers/${id}/status`, {})
            )
            setUsers((prev) => prev.map((u) =>
                u.id === id ? { ...u, status: response.data.status } : u
            ))
        } catch (error) {
            console.error('Toggle farmer status error:', error.message)
        }
    }

    const toggleAdminStatus = async (id) => {
        try {
            const response = await import('../api/axios').then(m =>
                m.default.patch(`/auth/admin/admins/${id}/status`, {})
            )
            setAdmins((prev) => prev.map((a) =>
                a.id === id ? { ...a, status: response.data.status } : a
            ))
        } catch (error) {
            console.error('Toggle admin status error:', error.message)
        }
    }

    // ── Rules actions ──
    const saveRules = async (rulesData) => {
        try {
            const data = await saveRulesApi(rulesData)
            setRules(data.rules)
            return { success: true, message: data.message }
        } catch (error) {
            const errors = error.response?.data?.errors || []
            const msg    = error.response?.data?.message || 'Failed to save rules'
            return { success: false, message: msg, errors }
        }
    }

    const resetRules = async () => {
        try {
            const data = await resetRulesApi()
            setRules(data.rules)
            return { success: true, message: data.message }
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to reset rules'
            }
        }
    }

    return (
        <AdminContext.Provider value={{
            // farmers
            users: usersWithSavedCounts,
            usersLoading,
            loadFarmers,

            // admins
            admins, adminsLoading,
            loadAdmins,

            // stats
            totalSavedDates, farmerCountMap, statsLoading,

            // rules
            rules, rulesLoading, rulesError,
            saveRules, resetRules, loadRules,

            // identity
            isSuperAdmin, adminName, adminEmail,

            // actions
            toggleFarmerStatus, deleteFarmer,
            toggleAdminStatus,  deleteAdmin,
            createAdmin
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export const useAdmin = () => useContext(AdminContext)
