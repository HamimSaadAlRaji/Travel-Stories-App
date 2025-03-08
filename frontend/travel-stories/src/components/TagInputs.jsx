import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

const TagInputs = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState([]);
  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleInputValue = (e) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTag();
    }
  };
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };
  return (
    <div>
      <div className="flex items-center flex-wrap gap-4 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className=" flex items-center text-sm text-cyan-400 bg-cyan-200/40 px-3 py-2  rounded-lg"
          >
            <GrMapLocation className="text-sm mr-2" /> {tag}
            <button
              onClick={() => {
                handleRemoveTag(tag);
              }}
            >
              <MdClose />
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-2">
        <input
          type="text"
          value={inputValue}
          className="text-sm bg-transparent px-3 py-2 rounded border outline-none"
          placeholder="Add a Location"
          onChange={handleInputValue}
          onKeyDown={handleKeyDown}
        />
        <button className=" " onClick={handleAddTag}>
          <MdAdd className="size-8 text-cyan-400 rounded hover:bg-cyan-400 hover:text-white border border-cyan-400 hover:border-white" />
        </button>
      </div>
    </div>
  );
};

export default TagInputs;
