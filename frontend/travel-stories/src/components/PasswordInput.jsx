import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPass, setisShowPass] = useState(false);

  const ChangeShowPass = () => {
    setisShowPass(!isShowPass);
  };
  return (
    <div className="flex items-center bg-cyan-600/5 px-5 rounded mb-3 ">
      <input
        value={value}
        onChange={onChange}
        type={isShowPass ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full  text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />
      {isShowPass ? (
        <FaRegEye
          size={25}
          className="text-slate-600 cursor-pointer"
          onClick={() => ChangeShowPass()}
        />
      ) : (
        <FaRegEyeSlash
          size={25}
          className="text-cyan-600 cursor-pointer"
          onClick={() => ChangeShowPass()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
