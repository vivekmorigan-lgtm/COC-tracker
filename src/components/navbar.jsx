import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import style from "../styles/nav.module.css";
import apiService from "../services/api";

function Nav({ setIsAuthenticated, setShowHelp }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.verifyToken();
        setUserData(response.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    apiService.logout();
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError("Please enter your email");
      return;
    }

    setResetLoading(true);
    setResetError("");

    try {
      await apiService.resetPassword(resetEmail);
      setResetSuccess(true);
      setResetEmail("");
      setTimeout(() => {
        setResetSuccess(false);
        setShowResetPopup(false);
      }, 3000);
    } catch (error) {
      setResetError(error.message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <nav className={style.nav}>
        <h3 className={style.coc}>Chiefs.io</h3>

        <div className={style.desktopIcons}>
          <button
            className={style.profileBtn}
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {userData?.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className={style.profileImg}
              />
            ) : (
              <i className="bi bi-person-circle"></i>
            )}
          </button>
        </div>

        {profileOpen && (
          <div className={style.profileDropdown}>
            <div className={style.userInfo}>
              {userData?.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className={style.dropdownProfileImg}
                />
              ) : (
                <div className={style.defaultAvatar}>
                  <i className="bi bi-person-circle"></i>
                </div>
              )}
              <div className={style.userDetails}>
                <h4>{userData?.name || "User"}</h4>
                <p>{userData?.email || ""}</p>
              </div>
            </div>

            <div className={style.dropdownDivider}></div>

            <button
              className={style.dropdownItem}
              onClick={() => {
                setProfileOpen(false);
                setShowResetPopup(true);
                setResetError("");
                setResetEmail(userData?.email || "");
              }}
            >
              <i className="bi bi-key"></i> Reset Password
            </button>
            <button
              className={style.dropdownItem}
              onClick={() => {
                setProfileOpen(false);
                if (setShowHelp) {
                  setShowHelp(true);
                }
              }}
            >
              <i className="bi bi-question-circle"></i> Help & Support
            </button>
            <button
              className={style.dropdownItem}
              onClick={() => {
                setProfileOpen(false);
                handleLogout();
              }}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>

            <div className={style.dropdownDivider}></div>

            <div className={style.contactSection}>
              <p className={style.contactTitle}>Contact & Social</p>
              <div className={style.socialButtons}>
                <button
                  className={style.socialBtn}
                  onClick={() =>
                    window.open(
                      "https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=twinzler@proton.me",
                      "_blank"
                    )
                  }
                  title="Contact"
                >
                  <i className="bi bi-headset"></i>
                </button>
                <button
                  className={style.socialBtn}
                  onClick={() =>
                    window.open(
                      "https://github.com/vivekmorigan-lgtm",
                      "_blank"
                    )
                  }
                  title="GitHub"
                >
                  <i className="bi bi-github"></i>
                </button>
                <button
                  className={style.socialBtn}
                  onClick={() =>
                    window.open(
                      "https://discord.com/users/1406246927300821032",
                      "_blank"
                    )
                  }
                  title="Discord"
                >
                  <i className="bi bi-discord"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {profileOpen && (
        <div
          className={style.dropdownBackdrop}
          onClick={() => setProfileOpen(false)}
        />
      )}

      {showResetPopup && (
        <div className={style.popupOverlay}>
          <div className={style.popupBox}>
            {resetSuccess ? (
              <>
                <div className={style.successIcon}>
                  <i className="bi bi-check-circle-fill"></i>
                </div>
                <h3>Email Sent!</h3>
                <p>
                  A password reset link has been sent to your email. Please
                  check your inbox and follow the instructions.
                </p>
              </>
            ) : (
              <>
                <h3>Reset Password</h3>
                <p>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  className={style.input}
                  disabled
                />
                {resetError && <p className={style.error}>{resetError}</p>}
                <div className={style.popupButtons}>
                  <button
                    className={style.btn}
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button
                    className={`${style.btn} ${style.cancelBtn}`}
                    onClick={() => {
                      setShowResetPopup(false);
                      setResetError("");
                      setResetEmail("");
                    }}
                    disabled={resetLoading}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Nav;
