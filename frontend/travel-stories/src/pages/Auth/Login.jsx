import React, { useState } from "react";
import PasswordInput from "../../components/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Use a valid Email");
      return;
    }
    if (!password) {
      setError("Please Enter a Password");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        console.log(response.data);
        console.log("navigating to dashboard");
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An Unexpected Error Occured");
      }
    }
  };
  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-box right-10 top-2" />
      <div className="login-box bottom-0 bg-cyan-200 right-1/2" />
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div className="w-2/4 h-[90vh] flex items-end bg-login-bg-image bg-cover bg-center rounded-lg p-10 z-50 ">
          <div>
            <h4 className="text-5xl text-white font-semibold leading -[50%]">
              Capture your <br />
              Journeys
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4 ">
              Record your travel experience and journey in your favourite
              journal
            </p>
          </div>
        </div>
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleLogin} className="">
            <h4 className="text-2xl font-semibold mb-7">LOGIN</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            {error && <p className="text-red-500 text-xs pb-4">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
          </form>
          <p className="text-xs text-slate-500 text-center my-4">Or</p>
          <button
            type="submit"
            className="btn-primary btn-light"
            onClick={() => {
              navigate("/signUp");
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
