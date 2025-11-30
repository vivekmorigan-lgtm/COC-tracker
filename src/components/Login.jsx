import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../userdata/firebase";
import style from "../styles/login.module.css";

export default function Login({ onSwitchToSignUp, onAuthSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // popup states
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (typeof onAuthSuccess === "function") onAuthSuccess();
    } catch (err) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const sendResetLink = () => {
    if (!resetEmail) {
      setError("Please enter your email.");
      return;
    }

    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setShowResetPopup(false);
        setSuccessPopup(true);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className={style.loginContainer}>

      {/* --------------- SUCCESS POPUP --------------- */}
      {successPopup && (
        <div className={style.popupOverlay}>
          <div className={style.popupBox}>
            <h3>Password Reset Email Sent</h3>
            <p>Check your inbox for the reset link.</p>
            <button onClick={() => setSuccessPopup(false)} className={style.btn}>
              OK
            </button>
          </div>
        </div>
      )}

      {/* --------------- RESET PASSWORD POPUP --------------- */}
      {showResetPopup && (
        <div className={style.popupOverlay}>
          <div className={style.popupBox}>
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className={style.input}
              required
              autoComplete="email"
            />

            {error && <p className={style.error}>{error}</p>}

            <button className={style.btn} onClick={sendResetLink}>
              Next
            </button>
            <button className={`${style.backBtn} ${style.btn}`} onClick={() => setShowResetPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* --------------- LOGIN BOX --------------- */}
      <div className={style.loginBox}>
        <h2 className={style.title}>Welcome Back!</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={style.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={style.input}
            required
          />

          {error && <p className={style.error}>{error}</p>}

          <button type="submit" className={style.btn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {onBack && (
            <button type="button" onClick={onBack} className={`${style.backBtn} ${style.btn}`}>
              Back
            </button>
          )}
        </form>

        <p className={style.toggleText}>
          Forgot your{" "}
          <span className={style.toggleLink} onClick={() => setShowResetPopup(true)}>
            password?
          </span>
        </p>

        <p className={style.toggleText}>
          Don't have an account?{" "}
          <span className={style.toggleLink} onClick={onSwitchToSignUp}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}
