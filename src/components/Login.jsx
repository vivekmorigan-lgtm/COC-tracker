import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../userdata/firebase";
import style from "../styles/login.module.css";

export default function Login({ onSwitchToSignUp, onAuthSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      if (typeof onAuthSuccess === "function") onAuthSuccess();
      // onAuthStateChanged in App.jsx will also handle the redirect
    } catch (err) {
      if (err && err.code === "auth/operation-not-allowed") {
        setError(
          "Email/password sign-in is disabled in Firebase Console. Enable it under Authentication → Sign-in method."
        );
      } else {
        setError(err.message || "Failed to sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.loginContainer}>
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
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={style.input}
            required
            autoComplete="current-password"
          />
          {error && <p className={style.error}>{error}</p>}
          <button type="submit" className={style.btn} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {onBack && <button type="button" onClick={onBack} className={`${style.btn} ${style.backBtn}`}>
            Back
          </button>}
        </form>
        <p className={style.toggleText}>
          Don't have an account?{" "}
          <span onClick={onSwitchToSignUp} className={style.toggleLink}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}