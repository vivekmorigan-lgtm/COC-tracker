import React, { useState, useEffect } from "react";
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "./components/navbar";
import Main from "./components/main-cont";
import { auth } from "./userdata/firebase";
import Land from "./components/land";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <Nav />
          <Main />
        </>
      ) : (
        <Land />
      )}
    </>
  );
}