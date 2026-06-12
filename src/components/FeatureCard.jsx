import './FeatureCard.css'

const FeatureCard = ({ icon, title, description, accent = false }) => {
  return (
    <div className={`feature-card ${accent ? 'feature-card-accent' : 'feature-card-normal'}`}>
      <div className="feature-icon-box">
        {icon}
      </div>
      <h5 className="feature-card-title">
        {title}
      </h5>
      <p className="feature-card-desc">
        {description}
      </p>
    </div>
  )
}

export default FeatureCard
