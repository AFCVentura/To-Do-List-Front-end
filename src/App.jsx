import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import NotAuthenticatedRoute from "./components/NotAuthenticatedRoute";
import Config from "./pages/Config";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthenticatedRoute>
                <Navigate to="/auth/login" />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/auth/login"
            element={
              <AuthenticatedRoute>
                <AuthPage key="login" authType="login" />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/auth/register"
            element={
              <AuthenticatedRoute>
                <AuthPage key="register" authType="register" />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/"
            element={
              <NotAuthenticatedRoute>
                <HomePage />
              </NotAuthenticatedRoute>
            }
          ></Route>
          <Route
            path="/config"
            element={
              <NotAuthenticatedRoute>
                <Config />
              </NotAuthenticatedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
