import { useState } from 'react'
import { useAdmin } from '../../context/DashboardContext'
import { Icon } from '../../utils/iconMap'
import { emojiFor } from '../../utils/emojiMap'
import './AdminFarmers.css'

const StatusBadge = ({ status }) => (
  <span className={`as-badge ${status === 'active' ? 'as-badge-active' : 'as-badge-inactive'}`}>
    {status === 'active' ? '● Active' : '● Inactive'}
  </span>
)

const LoadingState = () => (
  <div className="as-card text-center py-5">
    <span className="spinner-border spinner-border-sm me-2 as-text-primary"></span>
    <span className="as-text-soft">Loading farmers...</span>
  </div>
)

const AdminFarmers = () => {
  const { users, usersLoading, toggleFarmerStatus, deleteFarmer } = useAdmin()
  const [search, setSearch]               = useState('')
  const [deleteModal, setDeleteModal]     = useState({ open: false, user: null })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [togglingId, setTogglingId]       = useState(null)

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const openDelete    = (user) => { setDeleteModal({ open: true, user }) }
  const closeDelete   = ()     => { setDeleteModal({ open: false, user: null }) }
  const confirmDelete = async () => {
    setDeleteLoading(true)
    await deleteFarmer(deleteModal.user.id)
    setDeleteLoading(false)
    closeDelete()
  }

  const handleToggle = async (id) => {
    setTogglingId(id)
    await toggleFarmerStatus(id)
    setTogglingId(null)
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div className="as-section-header">
          <div className="as-header-line" />
          <h5 className="as-section-title">Farmer Management</h5>
        </div>
        <div className="farmer-search-wrapper">
          <i className="bi bi-search farmer-search-icon"></i>
          <input
            type="text"
            placeholder="Search farmers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="as-input farmer-search-input"
          />
        </div>
      </div>

      {usersLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* ── Desktop Table ── */}
          <div className="d-none d-md-block as-card p-4">
            <div className="as-table-container">
              <table className="as-table">
                <thead>
                  <tr>
                    {['Farmer', 'Location', 'Joined', 'Saved', 'Status', 'Actions'].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.name} className="as-avatar farmer-table-avatar" />
                          ) : (
                            <div className="as-avatar-placeholder farmer-table-placeholder">
                              {u.name[0]}
                            </div>
                          )}
                          <div>
                            <div className="as-text-primary fw-bold farmer-name-main">{u.name}</div>
                            <div className="as-text-soft farmer-email-sub">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="as-text-soft farmer-location-text">{u.location}</td>
                      <td className="as-text-soft farmer-joined-text">{u.joined}</td>
                      <td className="as-text-accent fw-bold text-center farmer-saved-text">{u.saved}</td>
                      <td><StatusBadge status={u.status} /></td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => handleToggle(u.id)}
                            disabled={togglingId === u.id}
                            className={`as-btn as-btn-outline py-1 px-3 farmer-action-btn-status ${u.status === 'active' ? 'btn-status-deactivate' : 'btn-status-activate'}`}
                          >
                            {togglingId === u.id ? (
                              <><span className="spinner-border spinner-border-sm me-1"></span>{u.status === 'active' ? 'Deactivating...' : 'Activating...'}</>
                            ) : (
                              u.status === 'active' ? 'Deactivate' : 'Activate'
                            )}
                          </button>
                          <button onClick={() => openDelete(u)} className="as-btn as-btn-danger p-2">
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-4 as-text-soft">
                {search ? `No farmers found matching "${search}"` : 'No farmers registered yet'}
              </div>
            )}
          </div>

          {/* ── Mobile Cards ── */}
          <div className="d-md-none">
            {filtered.length === 0 ? (
              <div className="as-card text-center py-4 as-text-soft">
                {search ? `No farmers found matching "${search}"` : 'No farmers registered yet'}
              </div>
            ) : filtered.map((u) => (
              <div key={u.id} className="as-card farmer-mobile-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    {u.avatarUrl ? (
                      <img src={u.avatarUrl} alt={u.name} className="as-avatar farmer-mobile-avatar" />
                    ) : (
                      <div className="as-avatar-placeholder farmer-mobile-placeholder">
                        {u.name[0]}
                      </div>
                    )}
                    <div>
                      <div className="as-text-primary fw-bold farmer-mobile-name">{u.name}</div>
                      <div className="as-text-soft farmer-mobile-email">{u.email}</div>
                    </div>
                  </div>
                  <StatusBadge status={u.status} />
                </div>
                <div className="as-text-soft farmer-mobile-meta">
                  <span className="me-1" aria-hidden="true">{emojiFor('location')}</span>{u.location} &nbsp;·&nbsp; <span className="me-1" aria-hidden="true">{emojiFor('calendar')}</span>{u.saved} saved &nbsp;·&nbsp; Joined {u.joined}
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleToggle(u.id)}
                    disabled={togglingId === u.id}
                    className={`as-btn flex-grow-1 py-2 farmer-mobile-action-btn ${u.status === 'active' ? 'btn-status-deactivate' : 'btn-status-activate'}`}
                  >
                    {togglingId === u.id ? (
                      <><span className="spinner-border spinner-border-sm me-1"></span>{u.status === 'active' ? 'Deactivating...' : 'Activating...'}</>
                    ) : (
                      u.status === 'active' ? 'Deactivate' : 'Activate'
                    )}
                  </button>
                  <button onClick={() => openDelete(u)} className="as-btn as-btn-danger px-3">
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Delete Modal ── */}
      {deleteModal.open && (
        <div className="farmer-modal-overlay" onClick={closeDelete}>
          <div className="as-card farmer-delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="delete-icon-circle"><Icon name="trash" /></div>
              <h5 className="as-text-primary fw-bold mb-2">Delete Farmer Account?</h5>
              <p className="as-text-soft m-0 delete-modal-text">
                You are about to permanently delete{' '}
                <strong className="as-text-primary">{deleteModal.user?.name}</strong>'s account and all their saved dates. This cannot be undone.
              </p>
            </div>
            <div className="d-flex gap-3">
              <button onClick={closeDelete} className="as-btn as-btn-outline flex-grow-1 py-2">Cancel</button>
              <button onClick={confirmDelete} disabled={deleteLoading} className="as-btn flex-grow-1 py-2 confirm-delete-button">
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

export default AdminFarmers
