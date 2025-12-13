import React, { useState } from "react";
import apiService from "../services/api";
import style from "../styles/login.module.css";

export default function SignUp({ onSwitchToLogin, onAuthSuccess, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a PNG, JPG, or JPEG image.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return;
      }

      setProfilePicture(file);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== rePassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      let profilePictureBase64 = null;
      if (profilePicture) {
        profilePictureBase64 = previewUrl;
      }

      await apiService.signup(email, password, name, profilePictureBase64);
      setEmail("");
      setPassword("");
      setRePassword("");
      setName("");
      setProfilePicture(null);
      setPreviewUrl(null);
      if (typeof onAuthSuccess === "function") onAuthSuccess();
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const check = () => {
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
    } else {
      setError("");
    }
  };

  const check2 = () => {
    if (rePassword.length === password.length && rePassword !== password) {
      setError("Passwords do not match.");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    check();
    check2();
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.loginBox}>
        <h2 className={style.title}>Create Account</h2>

        <div className={style.horizontalLayout}>
          <div className={style.formSection}>
            <form onSubmit={handleSignUp}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={style.input}
                required
                autoComplete="name"
              />
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
              <div className={style.fileInputContainer}>
                <label htmlFor="profilePicture" className={style.fileLabel}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className={style.preview}
                    />
                  ) : (
                    <span>Upload Profile Picture</span>
                  )}
                </label>
                <input
                  id="profilePicture"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className={style.fileInput}
                />
              </div>
              {error && <p className={style.error}>{error}</p>}

              <div className={style.btnGroup}>
                <button type="submit" className={style.btn} disabled={loading}>
                  {loading ? "Creating..." : "Sign Up"}
                </button>
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className={`${style.btn} ${style.backBtn}`}
                  >
                    Back
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <p className={style.toggleText}>
          Already have an account?{" "}
          <span onClick={onSwitchToLogin} className={style.toggleLink}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
