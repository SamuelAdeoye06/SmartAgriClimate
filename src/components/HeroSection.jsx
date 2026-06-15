import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './HeroSection.css'

const slides = [
  {
    iconClass: "bi-cloud-sun-fill",
    badge: "Smart Weather Intelligence",
    title: (
      <>
        Know what farm work is{' '}
        <span className="hero-title-accent">safe today</span>{' '}
        before you step into the field
      </>
    ),
    desc: "SmartAgriClimate turns your farm location, crop profile, and 7-day weather forecast into clear recommendations for planting, harvesting, spraying, irrigation, and other tasks.",
    bgImage: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80"
  },
  {
    iconClass: "bi-journal-richtext",
    badge: "Crop Advisory Guide",
    title: (
      <>
        Practical guidance tailored{' '}
        <span className="hero-title-accent">for your crops</span>{' '}
        to protect your yield
      </>
    ),
    desc: "Review crop-specific advice for planting, soil care, watering, harvest signs, storage, and common pests across the crop categories you grow.",
    bgImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80"
  },
  {
    iconClass: "bi-bug-fill",
    badge: "Pest & Disease Identifier",
    title: (
      <>
        Spot crop problems{' '}
        <span className="hero-title-accent">before they spread</span>{' '}
        across the field
      </>
    ),
    desc: "Select visible symptoms and get likely pest or disease matches with prevention, organic control, and chemical control notes.",
    bgImage: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1920&q=80"
  }
]

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const stats = [
    { value: '8', label: 'Farm Activities' },
    { value: '8', label: 'Crop Categories' },
    { value: '20', label: 'Symptom Checks' },
  ]

  return (
    <section className="hero-wrapper">
      {/* Background Images Carousel */}
      <div className="hero-carousel-bg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.bgImage})` }}
          />
        ))}
        <div className="hero-carousel-overlay" />
      </div>

      <div className="container position-relative hero-content-container">
        {/* Navigation Arrows */}
        <button className="hero-carousel-arrow arrow-left" onClick={handlePrev} aria-label="Previous Slide">
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="hero-carousel-arrow arrow-right" onClick={handleNext} aria-label="Next Slide">
          <i className="bi bi-chevron-right"></i>
        </button>

        <div className="row align-items-center gy-5 hero-content-row">

          {/* Left: Text */}
          <div className="col-lg-6 text-center text-lg-start hero-copy">
            <span className="badge mb-3 px-3 py-2 hero-badge">
              <i className={`bi ${slides[currentSlide].iconClass} me-2 text-success`}></i>
              {slides[currentSlide].badge}
            </span>

            <h1 className="hero-title">
              {slides[currentSlide].title}
            </h1>

            <p className="hero-desc mx-auto mx-lg-0">
              {slides[currentSlide].desc}
            </p>

            {/* Buttons */}
            <div className="hero-actions">
              <Link to="/register" className="btn hero-btn-primary">
                Start Free Today <i className="bi bi-arrow-right ms-2"></i>
              </Link>
              <a href="#features" className="btn hero-btn-secondary">
                Explore the System
              </a>
            </div>

            {/* Carousel Dots / Indicators (SIWESlog style) */}
            <div className="hero-carousel-dots">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`hero-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="hero-stats">
              {stats.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <div className="hero-stat-value">{stat.value}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="col-lg-6 d-flex justify-content-center justify-content-lg-end">
            <div className="hero-screenshot-frame">
              <div className="hero-screenshot-topbar">
                <div className="hero-window-dots" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="hero-live-pill">Real farmer dashboard</span>
              </div>
              <picture>
                <source media="(max-width: 767px)" srcSet="/landing-dashboard-mobile.png" />
                <img
                  className="hero-dashboard-shot"
                  src="/landing-dashboard-desktop.png"
                  alt="SmartAgriClimate farmer dashboard showing weather cards, condition status, forecast, and saved dates"
                />
              </picture>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
