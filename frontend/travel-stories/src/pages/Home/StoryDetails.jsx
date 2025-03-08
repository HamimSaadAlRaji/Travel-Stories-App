import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const StoryDetails = () => {
  const { id } = useParams(); // Get the story ID from the URL
  const [story, setStory] = useState(null); // State to store the story
  const [loading, setLoading] = useState(true); // State to handle loading
  const [isEditing, setIsEditing] = useState(false); // State for editing
  const [editData, setEditData] = useState({}); // State for edit inputs

  useEffect(() => {
    const getStory = async () => {
      try {
        const response = await axiosInstance.get("/get-all-travel-stories");
        const foundStory = response.data.stories.travelStory.find(
          (prod) => prod._id === id
        );
        setStory(foundStory); // Update state with the fetched story
        setEditData(foundStory); // Initialize edit data
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    getStory();
  }, [id]); // Run the effect whenever the `id` changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveEditedStory = async () => {
    try {
      await axiosInstance.put(`/update-story/${id}`, editData); // Update API call
      setStory(editData); // Update story state
      setIsEditing(false); // Close editing mode
      alert("Story updated successfully!");
    } catch (error) {
      console.error("Error updating story:", error);
      alert("Failed to update the story.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700 animate-pulse">Loading story...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-red-500">Story not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-4 md:p-8 ">
      <div className="flex-1 max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-full">
        {/* Story Image */}
        <img
          src={story.imageUrl || "https://via.placeholder.com/800x400"}
          alt={story.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 flex flex-col flex-grow">
          {/* Story Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {story.title}
          </h1>
          {/* Story Content */}
          <p className="text-gray-600 leading-relaxed text-lg mb-4 border p-4 flex-grow">
            {story.story}
          </p>
          {/* Additional Details */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg">
              <strong>Visited Location:</strong>{" "}
              {story.visitedLocation.join(", ")}
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
              <strong>Visited Date:</strong>{" "}
              {new Date(story.visitedDate).toLocaleDateString()}
            </div>
          </div>
          {/* Favourite and Public Status */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  story.isFavourite
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {story.isFavourite ? "Favourite" : "Not Favourite"}
              </span>
            </div>
            {/* Action Buttons */}
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
              onClick={() => setIsEditing(true)}
            >
              Edit Story
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Story</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={editData.title || ""}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Story</label>
              <textarea
                name="story"
                value={editData.story || ""}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-2 mt-1"
                rows="4"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                onClick={saveEditedStory}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryDetails;
