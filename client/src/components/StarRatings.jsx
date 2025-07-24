import React from "react";
import assets from "../assets/assets";

const StarRating = ({ rating = 0 }) => {
    return (
        <div className="flex gap-1">
            {Array(5).fill('').map((_, index) => (
                <img
                    src={rating > index ? assets.starIconFilled : assets.starIconOutlined}
                    alt={rating > index ? "Filled star" : "Empty star"}
                    className="h-5 w-5"
                    key={index}
                    onError={(e) => (e.target.src = assets.fallbackImage || "")}
                />
            ))}
        </div>
    );
};

export default StarRating;