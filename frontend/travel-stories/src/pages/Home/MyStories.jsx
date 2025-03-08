import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/TravelStoryCard";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const MyStories = () => {
  const navigate = useNavigate();
  const [allMyStories, setAllMyStories] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const getAllMyStories = async () => {
    try {
      const response = await axiosInstance.get("/get-travel-stories");
      if (response.data && response.data.stories) {
        setAllMyStories(response.data.stories.travelStory);
      }
    } catch (error) {
      console.log(error.response.message);
    }
  };
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status == 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  const handleViewStory = (id) => {
    navigate(`/story/${id}`);
  };
  useEffect(() => {
    getAllMyStories();
    getUserInfo();
    console.log(allMyStories.length);
    return () => {};
  }, []);
  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allMyStories.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {allMyStories.map((items) => {
                  return (
                    <TravelStoryCard
                      key={items._id}
                      imgUrl={items.imageUrl}
                      title={items.title}
                      story={items.story}
                      date={items.visitedDate}
                      visitedLocation={items.visitedLocation}
                      isFavourite={items.isFavourite}
                      onEdit={() => {
                        handleEdit();
                      }}
                      onClick={() => {
                        handleViewStory(items._id);
                      }}
                      onFavouriteClick={() => {
                        updateIsFavourite(items);
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <>Empty Card Here</>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyStories;
