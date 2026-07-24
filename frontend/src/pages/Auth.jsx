/* frontend/src/pages/Auth.jsx
Alfie Staunton
03.07.26
*/

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth() {
  //toggle between login and register modes
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  //form input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  //handle form submission to express backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { email, password }
      : { username, email, password };

    try {
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload,
      );

      if (isLogin) {
        //save secure token to browser storage
        localStorage.setItem("token", response.data.token);

        //extract username or fallback to email
        const extractedUsername =
          response.data.user?.username || email.split("@")[0];

        //save extract
        localStorage.setItem(
          "user",
          JSON.stringify({ username: extractedUsername }),
        );

        setMessage("Login successful! Redirecting...");
        navigate("/Dashboard"); //redirect to dashboard after successful login

        //temp consol log until dashboard complete
        console.log("Logged in user info:", response.data.user);
      } else {
        setMessage("Registration successful! Please log in.");
        setIsLogin(true); //switch to login automatically
      }
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred. PPlease try again.",
      );
    }
  };

  //temp layout
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "400px",
        margin: "40px auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#2e7d32" }}>Dúlra</h1>
      <h2>{isLogin ? "Log In" : "Create Account"}</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            fontSize: "16px",
            backgroundColor: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLogin ? "Sign In" : "Register"}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "15px",
            color: message.includes("successful") ? "green" : "red",
          }}
        >
          {message}{" "}
        </p>
      )}

      <p style={{ marginTop: "20px" }}>
        {isLogin ? "Dont have an account? " : "Already have an account?"}
        <span
          onClick={() => setIsLogin(!isLogin)}
          style={{
            color: "#2e7d32",
            cursor: "pointer",
            textDecoration: "underline",
            fontWeight: "bold",
          }}
        >
          {isLogin ? "Register here" : "Log in here"}
        </span>
      </p>
    </div>
  );
}

export default Auth;
