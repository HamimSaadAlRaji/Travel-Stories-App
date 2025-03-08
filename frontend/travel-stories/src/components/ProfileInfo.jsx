import React from "react";
import { getInitials } from "../utils/helper";

const ProfileInfo = ({ userInfo, onLogOut }) => {
  return (
    userInfo && (
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-cyan-200">
          {getInitials(userInfo ? userInfo.fullname : " ")}
        </div>
        <div className="">
          <p className="text-sm font-medium">{userInfo.fullname || ""}</p>
          <button
            className="text-sm text-slate-700 underline"
            onClick={onLogOut}
          >
            LogOut
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfo;
