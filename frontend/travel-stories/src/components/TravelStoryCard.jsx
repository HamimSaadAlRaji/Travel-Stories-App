import React from "react";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import moment from "moment/moment";

const TravelStoryCard = ({
  imgUrl,
  title,
  story,
  date,
  visitedLocation,
  isFavourite,
  onEdit,
  onClick,
  onFavouriteClick,
}) => {
  return (
    <div className="border rounder-lg bg-white hover:shadow-lg shadow-slate-500 relative cursor-pointer transition-all ease-in-out">
      <img
        src={imgUrl}
        alt="Image"
        className="w-full h-56 object-cover rounded-lg"
        onClick={onClick}
      />
      <div className="p-4" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex-2">
              <h6 className="text-sm font-medium">{title}</h6>
              <button
                className="w-12 h-12 items-center justify-center bg-white/40 rounded-lg border border-white/40 absolute top-4 right-4"
                onClick={onFavouriteClick}
              >
                <FaHeart
                  className={`icon-btn ${
                    isFavourite ? "text-red-600" : "text-white"
                  }`}
                />
              </button>
            </div>
            <span className="text-xs text-slate-500">
              {date ? moment(date).format("Do MMM YYYY") : "-"}
            </span>
          </div>
        </div>
        <p className="text-xs">{story.slice(0, 60)}</p>

        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-700 bg-cyan-200/40 rounded-lg px-1 py-1 mt-2">
          <GrMapLocation className="text-sm" />
          {visitedLocation.map((item, index) =>
            visitedLocation.length == index + 1 ? `${item}` : `${item}, `
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
