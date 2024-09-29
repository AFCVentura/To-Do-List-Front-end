import { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import Test from "./pages/Test";

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/test" element={<Test />} />
          <Route path="/auth" element={<Navigate to="/auth/login" />}></Route>
          <Route
            path="/auth/login"
            element={<AuthPage authType="login" />}
          ></Route>
          <Route
            path="/auth/register"
            element={<AuthPage authType="register" />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
