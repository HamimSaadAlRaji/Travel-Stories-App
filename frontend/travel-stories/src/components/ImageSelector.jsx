import React, { useEffect, useRef, useState } from "react";
import { use } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [prevUrl, setprevUrl] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };
  const onChooseFile = () => {
    inputRef.current.click();
  };
  const handleImageDelete = () => {
    setImage(null); // Clear the image state after revoking the URL.
    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input.
    }
  };
  useEffect(() => {
    if (typeof image == "string") {
      setprevUrl(image);
    } else if (image) {
      setprevUrl(URL.createObjectURL(image));
    } else {
      setprevUrl(null);
    }

    return () => {
      if (prevUrl && typeof prevUrl === "string" && !image) {
        URL.revokeObjectURL(prevUrl);
      }
    };
  }, [image]);
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center bg-slate-400 gap-4 rounded-lg border border-dashed border-slate-500 text-slate-500 hover:bg-slate-500 hover:text-slate-100"
          onClick={() => onChooseFile()}
        >
          <div className="size-16 flex justify-center items-center bg-slate-200 rounded-full ">
            <FaRegFileImage className="text-2xl text-cyan-300" />
          </div>
          <p>Browse image to upload</p>
        </button>
      ) : (
        <div className="w-full relative">
          <img
            src={prevUrl}
            alt="preview"
            className="w-full h-[400px] object-cover rounded-lg"
          />
          <button
            className="absolute top-2 right-2 hover:bg-red-200 rounded-full p-1"
            onClick={handleImageDelete}
          >
            <MdDeleteOutline className="text-lg text-red-400 size-7 hover:text-white " />
          </button>
        </div>
      )}
    </div>
  );
};
export default ImageSelector;
