import React, { useContext, useEffect, useState } from "react";
import { useAxios } from "../hooks/useAxios";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [{ response, loading, error }, axiosRequest] = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axiosRequest({
      method: "POST",
      url: "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        password,
      },
    });
  };

  useEffect(() => {
    if (response.length !== 0) {
      sessionStorage.setItem("token", response.data.token);
      if (response.status == 200) {
        
      }
    }
  }, [response]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha
          <input type="text" onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">Login</button>
        {sessionStorage.getItem("token") && <Navigate to="/" />}
      </form>
    </div>
  );
}
