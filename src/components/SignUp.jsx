import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../userdata/firebase";
import style from "../styles/login.module.css";

export default function SignUp({ onSwitchToLogin, onAuthSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      if (typeof onAuthSuccess === "function") onAuthSuccess();
    } catch (err) {
      if (err && err.code === "auth/operation-not-allowed") {
        setError(
          "Email/password sign-up is disabled in Firebase Console. Enable it under Authentication → Sign-in method."
        );
      } else {
        setError(err.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  const check = () => {
    if (password.length < 6){
      setError("Password should be at least 6 characters long.");
    }
    else {
      setError("");
    }
  }

  const check2 = () => {
    if (rePassword.length === password.length && rePassword !== password){
      setError("Passwords do not match.");
    }
    else {
      setError("");
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    check();
    check2();
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.loginBox}>
        <h2 className={style.title}>Create Account</h2>
        <form onSubmit={handleSignUp}>
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
            autoComplete="new-password"
          />
          <input
           type="password" 
           placeholder="Re-enter password" 
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
           className={style.input} 
           required 
           />
          {error && <p className={style.error}>{error}</p>}
          <button type="submit" className={style.btn} disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
          {onBack && <button type="button" onClick={onBack} className={`${style.btn} ${style.backBtn}`}>
            Back
          </button>}
        </form>
        <p className={style.toggleText}>
          Already have an account?{" "}
          <span onClick={onSwitchToLogin} className={style.toggleLink}>Login</span>
        </p>
      </div>
    </div>
  );
}