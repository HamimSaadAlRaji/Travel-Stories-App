import React, { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/DateSelector";
import ImageSelector from "../../components/ImageSelector";
import TagInputs from "../../components/TagInputs";
import moment from "moment";

const EditTravelStories = ({ storyInfo, type, onClose, getAllStories }) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [storyImg, setStoryImg] = useState(null);
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
        imageUrl = ImgUploadRes.url;
      }
      const response = await axiosInstance.post("/add-travel-stories", {
        title,
        story,
        visitedLocation,
        imageUrl,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });
      if (response && response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllStories();
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add story");
    }
  };

  const updateStory = async () => {
    try {
      let imageUrl = storyInfo?.imageUrl || "";
      if (storyImg) {
        const ImgUploadRes = await uploadImage(storyImg);
        imageUrl = ImgUploadRes.url;
      }
      const response = await axiosInstance.put(
        `/update-travel-story/${storyInfo.id}`,
        {
          title,
          story,
          visitedLocation,
          imageUrl,
          visitedDate: moment(visitedDate).valueOf(),
        }
      );
      if (response && response.data && response.data.updatedStory) {
        toast.success("Story Updated Successfully");
        getAllStories();
        onClose();
      }
    } catch (err) {
      console.error(err);
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

    if (type === "add") {
      addNewStory();
    } else {
      updateStory();
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
