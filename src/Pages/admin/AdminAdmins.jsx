import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/DashboardContext'
import { Icon } from '../../utils/iconMap'
import './AdminAdmins.css'

const RoleBadge = ({ role }) => (
  <span className={`as-badge ${role === 'super_admin' ? 'as-badge-super' : 'as-badge-active'} px-3`}>
    {role === 'super_admin' ? <><Icon name="admin" className="me-1" />Super Admin</> : 'Admin'}
  </span>
)

const StatusBadge = ({ status }) => (
  <span className={`as-badge ${status === 'active' ? 'as-badge-active' : 'as-badge-inactive'}`}>
    {status === 'active' ? '● Active' : '● Inactive'}
  </span>
)

const AdminAdmins = () => {
  const { admins, adminsLoading, toggleAdminStatus, deleteAdmin } = useAdmin()
  const navigate = useNavigate()
  const [search, setSearch]               = useState('')
  const [deleteModal, setDeleteModal]     = useState({ open: false, admin: null })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [togglingId, setTogglingId]       = useState(null)

  const filtered = admins.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  const openDelete    = (admin) => { setDeleteModal({ open: true, admin }) }
  const closeDelete   = ()      => { setDeleteModal({ open: false, admin: null }) }
  const confirmDelete = async () => {
    setDeleteLoading(true)
    await deleteAdmin(deleteModal.admin.id)
    setDeleteLoading(false)
    closeDelete()
  }

  const handleToggle = async (id) => {
    setTogglingId(id)
    await toggleAdminStatus(id)
    setTogglingId(null)
  }

  return (
    <>
      <div className="admin-header-container">
        <div className="as-section-header">
          <div className="as-header-line" />
          <h5 className="as-section-title">Admin Accounts</h5>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <div className="search-wrapper">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              placeholder="Search admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="as-input admin-search-input"
            />
          </div>
          <button
            onClick={() => navigate('/admin/register')}
            className="as-btn as-btn-primary px-4 py-2 add-admin-btn"
          >
            <i className="bi bi-person-plus me-2"></i>Add Admin
          </button>
        </div>
      </div>

      <div className="info-banner">
        <i className="bi bi-shield-exclamation info-banner-icon"></i>
        <p className="info-banner-text">
          As <strong>Super Admin</strong>, you can activate, deactivate, and delete regular admin accounts. The Super Admin account cannot be modified.
        </p>
      </div>

      {adminsLoading ? (
        <div className="as-card text-center py-5">
          <span className="spinner-border spinner-border-sm me-2 as-text-primary"></span>
          <span className="as-text-soft">Loading admins...</span>
        </div>
      ) : (
        <>
          {/* ── Desktop Table ── */}
          <div className="d-none d-md-block as-card p-4">
            <div className="as-table-container">
              <table className="as-table">
                <thead>
                  <tr>
                    {['Admin', 'Role', 'Joined', 'Status', 'Actions'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const isSelf = a.role === 'super_admin'
                    return (
                      <tr key={a.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {a.avatarUrl ? (
                              <img src={a.avatarUrl} alt={a.name} className="as-avatar admin-table-avatar" />
                            ) : (
                              <div className={`as-avatar-placeholder ${isSelf ? 'admin-avatar-placeholder-self' : 'admin-avatar-placeholder-other'}`}>
                                {a.name[0]}
                              </div>
                            )}
                            <div>
                              <div className="as-text-primary fw-bold admin-name-text">
                                {a.name}
                                {isSelf && <span className="as-text-primary ms-2 admin-email-text">(you)</span>}
                              </div>
                              <div className="as-text-soft admin-email-text">{a.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><RoleBadge role={a.role} /></td>
                        <td className="as-text-soft admin-joined-text">{a.joined}</td>
                        <td>
                          {isSelf
                            ? <span className="as-text-soft empty-status-text">—</span>
                            : <StatusBadge status={a.status} />
                          }
                        </td>
                        <td>
                          {isSelf ? (
                            <span className="as-text-soft protected-text">Protected</span>
                          ) : (
                            <div className="d-flex gap-2">
                              <button
                                onClick={() => handleToggle(a.id)}
                                disabled={togglingId === a.id}
                                className={`as-btn as-btn-outline py-1 px-3 admin-action-btn-status ${a.status === 'active' ? 'btn-status-deactivate' : 'btn-status-activate'}`}
                              >
                                {togglingId === a.id ? (
                                  <><span className="spinner-border spinner-border-sm me-1"></span>{a.status === 'active' ? 'Deactivating...' : 'Activating...'}</>
                                ) : (
                                  a.status === 'active' ? 'Deactivate' : 'Activate'
                                )}
                              </button>
                              <button onClick={() => openDelete(a)} className="as-btn as-btn-danger p-2">
                                <i className="bi bi-trash3"></i>
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-4 as-text-soft">No admins found</div>
            )}
          </div>

          {/* ── Mobile Cards ── */}
          <div className="d-md-none">
            {filtered.map((a) => {
              const isSelf = a.role === 'super_admin'
              return (
                <div key={a.id} className={`as-card admin-mobile-card p-3 ${isSelf ? 'border border-success' : ''}`}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {a.avatarUrl ? (
                        <img src={a.avatarUrl} alt={a.name} className="as-avatar admin-mobile-avatar" />
                      ) : (
                        <div className={`as-avatar-placeholder ${isSelf ? 'admin-mobile-avatar-placeholder-self' : 'admin-mobile-avatar-placeholder-other'}`}>
                          {a.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="as-text-primary fw-bold admin-mobile-name">
                          {a.name}
                          {isSelf && <span className="as-text-primary ms-2 admin-email-text">(you)</span>}
                        </div>
                        <div className="as-text-soft admin-email-text">{a.email}</div>
                      </div>
                    </div>
                    <RoleBadge role={a.role} />
                  </div>
                  <div className="as-text-soft admin-mobile-meta">
                    Joined {a.joined}
                    {!isSelf && <> &nbsp;·&nbsp; <StatusBadge status={a.status} /></>}
                  </div>
                  {!isSelf && (
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleToggle(a.id)}
                        disabled={togglingId === a.id}
                        className={`as-btn flex-grow-1 py-2 admin-action-btn-status ${a.status === 'active' ? 'btn-status-deactivate' : 'btn-status-activate'}`}
                      >
                        {togglingId === a.id ? (
                          <><span className="spinner-border spinner-border-sm me-1"></span>{a.status === 'active' ? 'Deactivating...' : 'Activating...'}</>
                        ) : (
                          a.status === 'active' ? 'Deactivate' : 'Activate'
                        )}
                      </button>
                      <button onClick={() => openDelete(a)} className="as-btn as-btn-danger px-3">
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── Delete Modal ── */}
      {deleteModal.open && (
        <div className="admin-modal-overlay" onClick={closeDelete}>
          <div className="as-card admin-delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="delete-icon-wrapper"><Icon name="trash" /></div>
              <h5 className="as-text-primary fw-bold mb-2">Delete Admin Account?</h5>
              <p className="as-text-soft m-0 delete-modal-desc">
                You are about to permanently remove{' '}
                <strong className="as-text-primary">{deleteModal.admin?.name}</strong> as an admin. They will lose all access. This cannot be undone.
              </p>
            </div>
            <div className="d-flex gap-3">
              <button onClick={closeDelete} className="as-btn as-btn-outline flex-grow-1 py-2">Cancel</button>
              <button onClick={confirmDelete} disabled={deleteLoading} className="as-btn flex-grow-1 py-2 confirm-delete-btn">
                {deleteLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-trash3 me-2"></i>}
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminAdmins
