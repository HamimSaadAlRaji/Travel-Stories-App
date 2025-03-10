import React, { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/DateSelector";
import ImageSelector from "../../components/ImageSelector";
import TagInputs from "../../components/TagInputs";
import moment from "moment";
import uploadImage from "../../utils/uploadImage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const EditTravelStories = ({ storyInfo, type, onClose, getAllUserStories }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || "");
  const [story, setStory] = useState(storyInfo?.story || "");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || "");
  const [error, setError] = useState("");

  const addNewStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const ImgUploadRes = await uploadImage(storyImg);
        console.log(ImgUploadRes.imageUrl);
        imageUrl = ImgUploadRes.imageUrl || "";
      }
      console.log({
        title,
        story,
        visitedLocation,
        imageUrl,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });
      const locationsArray = Array.isArray(visitedLocation)
        ? visitedLocation
        : [visitedLocation];
      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        visitedLocation: locationsArray,
        imageUrl,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        onClose();
        navigate(0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add story");
    }
  };

  const updateStory = async () => {
    try {
      let imageUrl = storyInfo?.imageUrl || "";
      if (storyImg instanceof File) {
        try {
          console.log("Uploading image:", storyImg);
          const ImgUploadRes = await uploadImage(storyImg);
          imageUrl = ImgUploadRes.imageUrl || "";
        } catch (err) {
          console.error("Image upload failed:", err);
          toast.error("Image upload failed. Please try again.");
          return;
        }
      }

      const locationsArray = Array.isArray(visitedLocation)
        ? visitedLocation
        : [visitedLocation];

      console.log("Updated Data:", {
        title,
        story,
        visitedLocation: locationsArray,
        imageUrl,
        visitedDate: moment(visitedDate).valueOf(),
      });

      const response = await axiosInstance.put(
        `/edit-travel-stories/${storyInfo._id}`,
        {
          title,
          story,
          visitedLocation: locationsArray,
          imageUrl,
          visitedDate: visitedDate
            ? moment(visitedDate).valueOf()
            : moment().valueOf(),
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        navigate(0);
        onClose();
      }
    } catch (err) {
      console.error("Error updating story:", err.response || err.message);
      toast.error("Failed to update story");
    }
  };

  const handleAddOrUpdateClick = () => {
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!story) {
      setError("Story is required");
      return;
    }
    setError("");

    if (type === "edit") {
      updateStory();
    } else {
      addNewStory();
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
          {type === "add" ? (
            <button className="btn-small" onClick={handleAddOrUpdateClick}>
              <MdAdd className="text-lg" /> ADD STORY
            </button>
          ) : (
            <>
              <button
                className="btn-small flex items-center gap-1"
                onClick={handleAddOrUpdateClick}
              >
                <MdUpdate className="text-lg" /> UPDATE STORY
              </button>
              <button
                className="btn-small btn-delete flex items-center gap-1"
                onClick={onClose}
              >
                <MdDeleteOutline className="text-lg" /> DELETE
              </button>
            </>
          )}
          <button className="" onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm flex justify-end">{error}</p>
      )}
      <div>
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className="text-xs text-slate-500">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A Day at the Great Wall"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>
          <ImageSelector image={storyImg} setImage={setStoryImg} />
          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />
          </div>
          <div className="pt-3">
            <label className="text-slate-400">Visited Location</label>
            <TagInputs tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTravelStories;
