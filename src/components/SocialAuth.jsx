import React from "react";
import "../Pages/Login.css";

const SocialAuth = ({ mode = "login" }) => {
  return (
    <>
      {/* Divider */}
      <div className="d-flex align-items-center gap-3 my-4">
        <hr className="auth-divider-line" />
        <span className="auth-divider-text">
          or continue with
        </span>
        <hr className="auth-divider-line" />
      </div>

      {/* Google Button */}
      <div className="d-flex gap-3">
        <button className="btn flex-grow-1 py-2 auth-social-btn">
          <i className="bi bi-google me-2"></i>
          {mode === "register" ? "Sign up with Google" : "Continue with Google"}
        </button>
      </div>
    </>
  );
};

export default SocialAuth;