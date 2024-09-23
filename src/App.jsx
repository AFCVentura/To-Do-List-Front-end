import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/auth" element={<AuthPage authType="login" />}></Route>
          <Route path="/auth/login" element={<AuthPage authType="login" />}></Route>
          <Route path="/auth/register" element={<AuthPage authType="register" />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
