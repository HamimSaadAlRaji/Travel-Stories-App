import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/TravelStoryCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditTravelStories from "./EditTravelStories";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const [allStories, setAllStories] = useState("");
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

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
  const getAllUserStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-travel-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories.travelStory);
      }
    } catch (error) {
      console.log(error.response.message);
    }
  };
  const updateIsFavourite = async (story) => {
    const storyId = story._id;
    try {
      const response = await axiosInstance.put(
        "/update-isfavourite/" + storyId,
        {
          isFavourite: !story.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Updated Favourites");
        getAllUserStories();
      }
    } catch (error) {
      console.log("lol bro how are you");
    }
  };
  const handleViewStory = (id) => {
    navigate(`/story/${id}`);
  };

  useEffect(() => {
    getUserInfo();
    getAllUserStories();
    console.log(allStories.length);
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {allStories.map((items) => {
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
          <div className="w-[350px]"></div>
        </div>
      </div>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <EditTravelStories
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllUserStories={getAllUserStories}
        />
      </Modal>

      <button
        className="h-16 w-16 flex items-center justify-center fixed right-10 bottom-10 rounded-full bg-primary hover:bg-cyan-300/40"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
