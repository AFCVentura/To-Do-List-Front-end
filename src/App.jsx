import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, [sessionStorage]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              !token ? (
                <Navigate to="/auth/login" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/auth/login"
            element={
              !token ? (
                <AuthPage authType="login" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/auth/register"
            element={
              !token ? (
                <AuthPage authType="register" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={
              !sessionStorage.getItem("token") ? (
                <Navigate to="/auth/login" />
              ) : (
                <HomePage />
              )
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
