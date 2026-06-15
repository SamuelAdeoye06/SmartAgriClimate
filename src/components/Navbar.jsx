import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg sticky-top px-4 as-navbar">
      <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
        <i className="bi bi-cloud-sun-fill text-success fs-4"></i>
        <span className="as-navbar-logo-text">
          SmartAgriClimate
        </span>
      </Link>

      <button
        className="navbar-toggler border-0 ms-auto me-3 as-navbar-toggler"
        type="button"
        onClick={() => setNavOpen(!navOpen)}
      >
        <span className="d-flex align-items-center justify-content-center">
          {navOpen ? <i className="bi bi-x fs-3"></i> : <i className="bi bi-list fs-3"></i>}
        </span>
      </button>

      <div className={`collapse navbar-collapse ${navOpen ? "show" : ""}`}>
        <ul className="navbar-nav mx-auto gap-lg-2">
          {["Features", "How It Works"].map((item) => (
            <li className="nav-item" key={item}>
              <a
                className="nav-link as-nav-link"
                href={`#${item.toLowerCase().replace(" ", "-")}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <div className="d-flex gap-2 mt-3 mt-lg-0">
          <Link
            className="btn btn-outline-light btn-sm px-4 as-navbar-btn-outline"
            to="/login"
          >
            Login
          </Link>
          <Link
            className="btn btn-success btn-sm px-4 as-navbar-btn-primary"
            to="/register"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
