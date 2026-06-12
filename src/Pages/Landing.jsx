import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import FeatureCard from '../components/FeatureCard'
import './Landing.css'

const features = [
  { icon: <i className="bi bi-geo-alt-fill text-success fs-3"></i>, title: 'Location-Based Forecasts', description: 'Farmers save a Nigerian city and state, then SmartAgriClimate fetches a 7-day forecast for that exact farm area.', accent: true },
  { icon: <i className="bi bi-check-circle-fill text-success fs-3"></i>, title: 'Daily Farming Decisions', description: 'Each day is labelled Optimal, Suitable, Restricted, or Unsafe based on the activities the weather can support.' },
  { icon: <i className="bi bi-list-check text-success fs-3"></i>, title: 'Eight Activity Checks', description: 'The engine checks planting, harvesting, spraying, irrigation, weeding, tillage, fertilizing, and pruning separately.', accent: true },
  { icon: <i className="bi bi-moon-stars-fill text-success fs-3"></i>, title: 'Day vs Night Timing', description: 'Today and tomorrow use hourly data so overnight rain or wind does not wrongly block safe daytime work.' },
  { icon: <i className="bi bi-leaf-fill text-success fs-3"></i>, title: 'Crop-Specific Advice', description: 'Farmers choose crop categories and receive tips for grains, tubers, legumes, vegetables, plantain, fruits, cash crops, and herbs.', accent: true },
  { icon: <i className="bi bi-shield-lock-fill text-success fs-3"></i>, title: 'Admin Rule Control', description: 'Admins can tune the thresholds, validate risky changes, manage farmers, and track saved planning dates.' },
]

const steps = [
  { number: '01', title: 'Register Your Farm', desc: 'Create a farmer account, choose your farm location, and optionally select what you grow.' },
  { number: '02', title: 'Fetch Weather Data', desc: 'SmartAgriClimate geocodes the location and reads temperature, rain, humidity, wind, and timing data.' },
  { number: '03', title: 'Run Farm Rules', desc: 'The decision engine compares the weather against activity thresholds and severe-alert limits.' },
  { number: '04', title: 'Plan the Work', desc: 'Save useful days with notes and crop plans so your dashboard becomes a practical farm calendar.' },
]

const conditionLabels = [
  { label: 'Optimal', desc: 'Five or more activities are recommended and there is no active daytime high-severity alert.' },
  { label: 'Suitable', desc: 'Three or four activities are recommended, making the day useful for farm work.' },
  { label: 'Restricted', desc: 'Only one or two activities pass the rules, so farmers should work carefully and limit tasks.' },
  { label: 'Unsafe', desc: 'No activities pass, or heavy daytime rain or dangerous daytime wind makes field work unsafe.' },
]

const activityRules = [
  'Planting needs moderate rain, humidity, safe wind, and 18-35°C temperatures.',
  'Harvesting prefers dry, low-wind weather so produce is not damaged or stored wet.',
  'Spraying is strict: very low rain, low wind, and no high heat to prevent wash-off, drift, and leaf burn.',
  'Irrigation is recommended when rain is low and temperature is high enough to stress crops.',
  'Weeding, tillage, fertilizing, and pruning each use their own moisture, wind, and temperature limits.',
]

const Landing = () => {
  return (
    <div className="landing-wrapper">

      <Navbar />
      <HeroSection />

      {/* ── Features ── */}
      <section id="features" className="landing-section-dark">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge mb-3 px-3 py-2 landing-badge">
              What's Inside
            </span>
            <h2 className="landing-title">
              Everything a Farmer Needs
            </h2>
            <p className="landing-subtitle">
              SmartAgriClimate is not just a weather display. It explains what the weather means for farm operations.
            </p>
          </div>

          <div className="row g-4">
            {features.map((f) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <FeatureCard {...f} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="landing-section-black">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="landing-title">
              How SmartAgriClimate Works
            </h2>
            <p className="landing-subtitle mx-auto landing-subtitle-constrained">
              From farmer profile to practical field recommendation.
            </p>
          </div>

          <div className="row g-4">
            {steps.map((step) => (
              <div className="col-sm-6 col-lg-3" key={step.number}>
                <div className="text-center step-card">
                  <div className="step-number">
                    {step.number}
                  </div>
                  <h5 className="step-title">{step.title}</h5>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Decision Engine ── */}
      <section className="landing-section-dark">
        <div className="container">
          <div className="row g-4 align-items-start">
            <div className="col-lg-5">
              <span className="badge mb-3 px-3 py-2 landing-badge">
                Decision Engine
              </span>
              <h2 className="landing-title">
                Weather is translated into farming conditions
              </h2>
              <p className="landing-subtitle mx-0">
                SmartAgriClimate scores every forecast day by counting how many farm activities pass the active weather rules. Severe daytime rain or wind can override everything and mark a day unsafe.
              </p>
            </div>
            <div className="col-lg-7">
              <div className="condition-grid">
                {conditionLabels.map((item) => (
                  <div className={`condition-card condition-card-${item.label.toLowerCase()}`} key={item.label}>
                    <h5>{item.label}</h5>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Activity Rules ── */}
      <section className="landing-section-black">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h2 className="landing-title">
                Built around real field tasks
              </h2>
              <p className="landing-subtitle mx-0">
                Farmers see recommended activities, severe weather alerts, crop-specific warnings, and a clear reason for the day&apos;s status.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="rules-list">
                {activityRules.map((rule) => (
                  <div className="rules-list-item" key={rule}>
                    <i className="bi bi-check-lg rules-list-check text-success"></i>
                    <p>{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="landing-cta-banner">
        <div className="container">
          <div className="cta-icon-box mb-3">
            <i className="bi bi-calendar4-range fs-1 text-success"></i>
          </div>
          <h2 className="landing-title mt-3 mb-2">
            Ready to turn weather into a farm plan?
          </h2>
          <p className="cta-desc">
            Create an account, set your farm profile, and let SmartAgriClimate show which farming activities are safe, restricted, or unsafe.
          </p>
          <Link to="/register" className="btn px-5 py-3 cta-btn-large">
            Create Free Account <i className="bi bi-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Landing
