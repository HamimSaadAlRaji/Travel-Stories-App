import React from "react";
import LOGO from "../assets/Logo.png";
import ProfileInfo from "./ProfileInfo";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getMyStories = () => {
    navigate("/myStories");
  };
  const getAllStories = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky  top-0 z-10">
      <img src={LOGO} className="h-9" />
      {token && (
        <button
          className="hover:underline text-cyan-700 "
          onClick={getAllStories}
        >
          All Stories
        </button>
      )}
      {token && (
        <button className="hover:underline text-black " onClick={getMyStories}>
          MY Stories
        </button>
      )}
      {token && <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />}
    </div>
  );
};

export default Navbar;
