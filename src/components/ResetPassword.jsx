import React, { useState, useEffect } from "react";
import apiService from "../services/api";
import style from "../styles/login.module.css";

export default function ResetPassword({ onSuccess, onBack }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(null);

  useEffect(() => {
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get("token");

    if (!resetToken) {
      setError("Invalid or missing reset token");
      setIsValidToken(false);
    } else {
      setToken(resetToken);
      setIsValidToken(true);
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiService.resetPasswordConfirm(token, newPassword);
      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.message || "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isValidToken === false) {
    return (
      <div className={style.loginContainer}>
        <div className={style.loginBox}>
          <h2 className={style.title}>Invalid Reset Link</h2>
          <p className={style.errorText}>
            The password reset link is invalid or has expired. Please request a
            new one.
          </p>
          {onBack && (
            <button
              type="button"
              className={style.submitButton}
              onClick={onBack}
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isValidToken === null) {
    return (
      <div className={style.loginContainer}>
        <div className={style.loginBox}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.loginContainer}>
      <div className={style.loginBox}>
        <h2 className={style.title}>Reset Password</h2>
        <p className={style.subtitle}>Enter your new password below</p>

        <form onSubmit={handleResetPassword} className={style.form}>
          <div className={style.inputGroup}>
            <label htmlFor="newPassword" className={style.label}>
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className={style.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={loading}
            />
          </div>

          <div className={style.inputGroup}>
            <label htmlFor="confirmPassword" className={style.label}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={style.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>

          {error && <div className={style.error}>{error}</div>}

          <button
            type="submit"
            className={style.submitButton}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {onBack && (
          <button
            type="button"
            className={style.backButton}
            onClick={onBack}
            disabled={loading}
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}
