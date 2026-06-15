import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/DashboardContext'
import { emojiFor } from '../../utils/emojiMap'
import './AdminOverview.css'

const AdminOverview = () => {
    const {
        users, usersLoading,
        admins, adminsLoading,
        totalSavedDates, statsLoading,
        isSuperAdmin
    } = useAdmin()
    const navigate = useNavigate()

    const stats = [
        {
            icon:  'farmer',
            label: 'Total Farmers',
            value: usersLoading ? '...' : users.length,
            color: '#52b788'
        },
        {
            icon:  'clear',
            label: 'Active Farmers',
            value: usersLoading ? '...' : users.filter(u => u.status === 'active').length,
            color: '#2d6a4f'
        },
        {
            icon:  'calendar',
            label: 'Total Saved Dates',
            value: statsLoading ? '...' : totalSavedDates,
            color: '#74c69d'
        },
        isSuperAdmin
            ? { icon: 'admin', label: 'Total Admins', value: adminsLoading ? '...' : admins.length, color: '#1b4332' }
            : { icon: 'rules',  label: 'Weather Rules', value: 'Configured', color: '#1b4332' }
    ]

    return (
        <div className="admin-overview-container">
            <div className="as-section-header mb-3">
                <div className="as-header-line" />
                <h5 className="as-section-title">Overview</h5>
            </div>

            {!isSuperAdmin && (
                <div className="regular-admin-alert">
                    <i className="bi bi-info-circle alert-icon"></i>
                    <p className="alert-text">
                        You're signed in as a <strong>Regular Admin</strong>. Admin management is restricted to the Super Admin.
                    </p>
                </div>
            )}

            <div className="row g-3 mb-4">
                {stats.map((s) => (
                    <div className="col-6 col-lg-3" key={s.label}>
                        <div className="as-card as-card-hover">
                            <div className="stat-icon" aria-hidden="true">{emojiFor(s.icon)}</div>
                            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                            <div className="as-text-primary fw-bold mt-2 stat-label">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-12">
                    <div className="as-card">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="as-text-primary fw-bold m-0">Recently Joined Farmers</h6>
                            <button
                                onClick={() => navigate('/admin/farmers')}
                                className="btn btn-sm as-text-primary fw-bold p-0 border-0"
                            >
                                View All <i className="bi bi-arrow-right ms-1"></i>
                            </button>
                        </div>
                        <div className="as-table-container">
                            <table className="as-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th className="d-none d-md-table-cell">Location</th>
                                        <th>Status</th>
                                        <th>Saved Dates</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.slice(0, 5).map((u) => (
                                        <tr key={u.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    {u.avatarUrl
                                                        ? <img src={u.avatarUrl} alt={u.name} className="as-avatar farmer-avatar" />
                                                        : <div className="as-avatar-placeholder farmer-avatar-placeholder">{u.name[0]}</div>
                                                    }
                                                    <div className="min-vw-0">
                                                        <div className="as-text-primary fw-bold farmer-name text-truncate">{u.name}</div>
                                                        <div className="as-text-soft farmer-email text-truncate d-none d-sm-block">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="as-text-soft d-none d-md-table-cell">{u.location}</td>
                                            <td>
                                                <span className={`as-badge ${u.status === 'active' ? 'as-badge-active' : 'as-badge-inactive'}`}>
                                                    {u.status === 'active' ? '● Active' : '● Inactive'}
                                                </span>
                                            </td>
                                            <td className="as-text-accent fw-bold">{u.saved}</td>
                                        </tr>
                                    ))}
                                    {!usersLoading && users.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 as-text-soft">
                                                No farmers registered yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminOverview
