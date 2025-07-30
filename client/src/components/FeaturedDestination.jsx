import React from "react";
import HotelCard from "./HotelCard"; // Fixed typo in filename (Hotelcard → HotelCard)
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();

  // Handle case where rooms is undefined or empty
  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50">
        <Title
          title="Featured Destination"
          subtitle="Discover the best hotels, world-class interiors, and rooms with fascinating views."
        />
        <p className="mt-20 text-gray-500">No featured destinations available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50">
      <Title
        title="Featured Destination"
        subtitle="Discover the best hotels, world-class interiors, and rooms with fascinating views."
      />
      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/rooms");
          window.scrollTo(0, 0); // Fixed scrollTo by adding window
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        View all destinations
      </button>
    </div>
  );
};

export default FeaturedDestination;