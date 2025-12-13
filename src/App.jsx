import React, { useState, useEffect } from "react";
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/navbar";
import Main from "./components/main-cont";
import Land from "./components/land";
import Loader from "./components/loader";
import apiService from "./services/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <Nav setIsAuthenticated={setIsAuthenticated} />
          <Main />
        </>
      ) : (
        <Land setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}
