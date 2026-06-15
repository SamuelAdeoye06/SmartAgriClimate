import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFarmer } from '../../context/DashboardContext'
import { Icon } from '../../utils/iconMap'
import { weatherEmoji } from '../../utils/emojiMap'
import './FarmerSavedDates.css'

const FarmerSavedDates = () => {
    const { savedDates, savedDatesLoading, deleteDate, updateNote } = useFarmer()
    const navigate = useNavigate()

    const [editingId, setEditingId]     = useState(null)
    const [editingText, setEditingText] = useState('')
    const [deletingId, setDeletingId]   = useState(null)
    const [error, setError]             = useState(null)

    const startEdit  = (d) => { setEditingId(d._id); setEditingText(d.note || '') }
    const cancelEdit = ()  => setEditingId(null)

    const saveEdit = async (id) => {
        const result = await updateNote(id, editingText)
        if (result.success) {
            setEditingId(null)
        } else {
            setError(result.message)
        }
    }

    const handleDelete = async (id) => {
        setDeletingId(id)
        const result = await deleteDate(id)
        if (!result.success) setError(result.message)
        setDeletingId(null)
    }

    // ── Loading ──
    if (savedDatesLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status" />
                <p className="as-text-soft mt-3">Loading your saved dates...</p>
            </div>
        )
    }

    return (
        <>
            <div className="saved-dates-header">
                <div className="as-section-header">
                    <div className="as-header-line" />
                    <h5 className="as-section-title">Saved Favorable Dates</h5>
                </div>
                <span className="saved-count-badge">{savedDates.length} saved</span>
            </div>

            {/* error message */}
            {error && (
                <div className="alert alert-danger py-2 mb-3" onClick={() => setError(null)}>
                    {error} <span className="float-end" style={{ cursor: 'pointer' }}><Icon name="bi-x-lg" /></span>
                </div>
            )}

            {savedDates.length === 0 ? (
                <div className="empty-saved-card">
                    <div className="empty-saved-icon">📅</div>
                    <h6 className="as-text-primary fw-bold">No Saved Dates Yet</h6>
                    <p className="empty-saved-subtitle">
                        Go to the Forecast section and save your best farming days.
                    </p>
                    <button
                        onClick={() => navigate('../forecast', { relative: 'path' })}
                        className="as-btn as-btn-primary px-4 py-2"
                    >
                        View Forecast
                    </button>
                </div>
            ) : (
                <div className="row g-3">
                    {savedDates.map((d) => (
                        <div className="col-12 col-md-6 col-xl-4" key={d._id}>
                            <div className="saved-date-card">

                                {/* ── Header ── */}
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                    <div>
                                        <div className="saved-card-title">
                                            {weatherEmoji(d.weatherSnapshot?.icon, '📅')} {d.dayLabel}
                                        </div>
                                        <div className="saved-card-meta">
                                            {d.date}
                                            {d.weatherSnapshot?.temp && ` · ${d.weatherSnapshot.temp}°C`}
                                            {d.weatherSnapshot?.rain !== undefined && ` · ${d.weatherSnapshot.rain}% rain`}
                                        </div>
                                        {d.cropName && (
                                            <div className="saved-card-crop mt-1">
                                                🌱 {d.cropName}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(d._id)}
                                        disabled={deletingId === d._id}
                                        className="btn delete-saved-btn"
                                    >
                                        {deletingId === d._id
                                            ? <span className="spinner-border spinner-border-sm" />
                                            : <i className="bi bi-trash3"></i>
                                        }
                                    </button>
                                </div>

                                {/* ── Decision badge ── */}
                                {d.recommendation && (
                                    <div className={`saved-card-recommendation mt-2 ${d.isGoodDay ? 'recommendation-good' : 'recommendation-poor'}`}>
                                        {d.isGoodDay ? '✓' : '⚠'} {d.recommendation}
                                    </div>
                                )}

                                {/* ── Note editor ── */}
                                {editingId === d._id ? (
                                    <div className="mt-3">
                                        <textarea
                                            rows={2}
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            className="note-textarea"
                                            placeholder="Add a note about this farming day..."
                                        />
                                        <div className="d-flex gap-2 mt-2">
                                            <button
                                                onClick={() => saveEdit(d._id)}
                                                className="as-btn as-btn-primary btn-sm flex-grow-1 py-2"
                                            >
                                                Save Note
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="as-btn as-btn-outline btn-sm px-3 py-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="note-display-box mt-3">
                                        <span className={`note-text-content ${d.note ? 'note-text-filled' : 'note-text-empty'}`}>
                                            {d.note || 'No note added yet...'}
                                        </span>
                                        <button onClick={() => startEdit(d)} className="edit-note-btn">
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default FarmerSavedDates
