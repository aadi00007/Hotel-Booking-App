import { useState, useEffect } from "react";
import HotelCard from "./Hotelcard.jsx"; // Fixed case and removed .jsx (assuming case consistency)
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  const filterHotels = () => {
    // Ensure rooms and searchedCities are defined to avoid errors
    if (!rooms || !searchedCities) {
      setRecommended([]);
      return;
    }
    const filteredHotels = rooms.filter((room) =>
      searchedCities.includes(room?.hotel?.city)
    );
    setRecommended(filteredHotels);
  };

  useEffect(() => {
    filterHotels();
  }, [rooms, searchedCities]);

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50">
      <Title
        title="Recommended Hotels"
        subtitle="Discover the best hotels, world-class interiors, and rooms with fascinating views."
      />
      {recommended.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>
      ) : (
        <p className="mt-20 text-gray-500">
          No recommended hotels found for the selected cities.
        </p>
      )}
    </div>
  );
};

export default RecommendedHotels;