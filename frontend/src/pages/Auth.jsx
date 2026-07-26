/* frontend/src/pages/Auth.jsx
Alfie Staunton
03.07.26
*/

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Leaf, Eye, EyeOff, ArrowRight} from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  //handle form submission
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
         "user", JSON.stringify({ username: extractedUsername }),
        );

        setMessage("Login successful! Redirecting...");

        //route new usre to onboarding -   existing user to dashboard
        if(localStorage.getItem("needsOnBoarding") === "true") {
          localStorage.removeItem("needsOnBoarding");
          navigate("/onboarding");

      } else {
        navigate("/Dashboard");
      }
    } else {
      //register
      setMessage("Registration successful! Please log in.");
      localStorage.setItem("needsOnBoarding", "true");
      setIsLogin(true);// swhich to log in
      setPassword(""); //clear password -security
      }
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An error occurred. PPlease try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

   return (
    <div className="min-h-screen  bg-gradient-to-br from-[#0a2414] via-[#1a5c35] to-[#1a6b8c] font-['Nunito'] flex justify-center items-center p-4">
      <div className="w-full max-w-[390px] flex flex-col">

        {/*Logo  and header*/}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <Leaf size={40} className="text-[#a3dpb8]"/>

            <div className="absolute bottom-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg text-lg">
              🦋
            </div>
          </div>

          {/*app name*/}
          <h1 className="font-['Lora'] text-4xl text-white font-bold mb-1 tracking-wide">
            Dúlra
          </h1>
          <p className="font-mono text-white/60 text-xs tracking-widest uppercase">
            Clár Fiadhúlra · Wildlife Recorder
          </p>
        </div>

        {/* login/reg tabs*/}
        <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1.5 mb-8 border border-white/10">
        <button
            onClick={() => {
              setIsLogin(true); setMessage(""); }}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              isLogin ? "bg-white text-[#1a5c35] shadow-md" : "text-white/70 hover:text-white"
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => { setIsLogin(false); setMessage("");
            }}
            className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              !isLogin ? "bg-white text-[#1a5c35] shadow-md" : "text-white/70 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>

        {/* register form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {!isLogin && (
            <div className="relative">
              <input
              type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:border-white/50 transition-colors"
              />
              </div>
          )}
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/10 backdrop-blur-md text-white placeholder-white/50 border border-white/20 rounded-xl px-5 py-4 focus:outline-none focus:border-white/50 transition-colors pr-12"
            />
              {/* password eye icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
            >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* submit*/}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-[#1a5c35] py-4 rounded-full font-bold flex items-center justify-center gap-2 mt-4 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:bg-[#f0f7f2] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isLoading ? "Please wait..." : (isLogin ? "Log in to Dúlra" : "Create account")}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        {/* footer */}
        <div className="mt-10 flex items-center justify-center gap-4 text-xs text-white/50">
          <button
          className="hover:text-white transition-colors">
            Terms of Service
            </button>
          <span>·</span>
          <button
          className="hover:text-white transition-colors"
          >
          Privacy Policy
            </button>
        </div>


      </div>
    </div>
   );
  }



