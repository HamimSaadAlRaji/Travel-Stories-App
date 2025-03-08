import React, { useState } from "react";
import PasswordInput from "../../components/PasswordInput";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please Enter Your Name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Use a valid Email");
      return;
    }
    if (!password) {
      setError("Please Enter Your Password");
      return;
    }
    if (confirmPassword != password) {
      setError("Password Does Not Match");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/create-account", {
        fullname: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
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
        <div className="w-2/4 h-[90vh] flex items-end bg-signup-bg-image bg-cover bg-center rounded-lg p-10 z-50 ">
          <div>
            <h4 className="text-5xl text-white font-semibold leading -[50%]">
              Join The <br />
              Adventure
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4 ">
              Create an account to start documenting you travels and preserving
              your memories in your personal journal
            </p>
          </div>
        </div>
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleSignUp} className="">
            <h4 className="text-2xl font-semibold mb-7 flex justify-center">
              SignUp
            </h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
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
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            {error && <p className="text-red-500 text-xs pb-4">{error}</p>}
            <button type="submit" className="btn-primary btn-light">
              Create Account
            </button>
          </form>
          <p className="text-xs text-slate-500 text-center my-4">Or</p>
          <button
            type="submit"
            onClick={() => {
              navigate("/login");
            }}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
