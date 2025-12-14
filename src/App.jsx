import React, { useState, useEffect } from "react";
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/navbar";
import Main from "./components/main-cont";
import Land from "./components/land";
import Loader from "./components/loader";
import ResetPassword from "./components/ResetPassword";
import HelpAndSupport from "./components/HelpAndSupport";
import apiService from "./services/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Check if we're on the reset password page
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get("token");

    if (resetToken) {
      setShowResetPassword(true);
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      const token = apiService.getToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await apiService.verifyToken();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleResetSuccess = () => {
    // Clear the URL parameter and redirect to main app
    window.history.replaceState({}, document.title, "/");
    setShowResetPassword(false);
    setIsAuthenticated(true);
  };

  const handleBackToLogin = () => {
    // Clear the URL parameter and go back to login
    window.history.replaceState({}, document.title, "/");
    setShowResetPassword(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (showResetPassword) {
    return (
      <ResetPassword
        onSuccess={handleResetSuccess}
        onBack={handleBackToLogin}
      />
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <Nav
            setIsAuthenticated={setIsAuthenticated}
            setShowHelp={setShowHelp}
          />
          {showHelp ? (
            <HelpAndSupport onBack={() => setShowHelp(false)} />
          ) : (
            <Main />
          )}
        </>
      ) : (
        <Land setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}
