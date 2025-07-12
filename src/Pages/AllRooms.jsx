import React, { useState } from "react";
import assets, { facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRatings";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onChange(e.target.checked, label)}
            />
            <span className="font-light">{label}</span>
        </label>
    );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
    return (
        <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
            <input
                type="radio"
                checked={selected}
                onChange={() => onChange(label)}
            />
            <span className="font-light">{label}</span>
        </label>
    );
};

const AllRooms = () => {
    const navigate = useNavigate();
    const [openfilters, setopenfilters] = useState(false);

    const roomTypes = [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite",
    ];
    const priceRanges = [
        "0 to 500",
        "500 to 1000",
        "1000 to 5000",
        "5000 to 15000",
    ];
    const sortOptions = [
        "Price Low to High",
        "Price High to Low",
    ];

    return (
        <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24">
            <div>
                <div className="flex flex-col items-start text-left">
                    <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
                    <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-[696px]">
                        Take advantage of our luxurious rooms!
                    </p>
                </div>

                {roomsDummyData.map((room) => (
                    <div
                        key={room._id}
                        className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-[120px] last:border-0"
                    >
                        <img
                            onClick={() => {
                                navigate(`/rooms/${room._id}`);
                                window.scrollTo(0, 0);
                            }}
                            src={room.images[0]}
                            alt={`${room.hotel.name} image`}
                            title="View Room Details"
                            className="max-h-[260px] md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
                        />
                        <div className="md:w-1/2 flex flex-col gap-2">
                            <p className="text-gray-500">{room.hotel.city}</p>
                            <p
                                className="text-gray-800 text-3xl font-playfair cursor-pointer"
                                onClick={() => {
                                    navigate(`/rooms/${room._id}`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                {room.hotel.name}
                            </p>
                            <div className="flex items-center">
                                <StarRating rating={5} />
                                <p className="ml-2">200+ reviews</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <img src={assets.locationIcon} alt="Location icon" className="w-5 h-5" />
                                <span>{room.hotel.address}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {room.amenities.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                                    >
                                        <img
                                            src={facilityIcons[item] || assets.fallbackImage}
                                            alt={`${item} icon`}
                                            className="w-5 h-5"
                                        />
                                        <p className="text-xs">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xl font-medium text-gray-700">
                                ${room.pricePerNight}/night
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
                <div
                    className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${
                        openfilters && "border-b"
                    }`}
                >
                    <p className="text-base font-medium text-gray-800">FILTERS</p>
                    <div className="text-xs cursor-pointer">
                        <button
                            type="button"
                            onClick={() => setopenfilters(!openfilters)}
                            className="lg:hidden"
                        >
                            {openfilters ? "HIDE" : "SHOW"}
                        </button>
                        <button type="button" className="hidden lg:block">
                            CLEAR
                        </button>
                    </div>
                </div>
                <div
                    className={`${
                        openfilters ? "h-auto" : "h-0 lg:h-auto"
                    } overflow-hidden transition-all duration-700`}
                >
                    <div className="px-5 pt-5">
                        <p className="font-medium text-gray-800 pb-2">Popular Filters</p>
                        {roomTypes.map((room, index) => (
                            <CheckBox key={index} label={room} />
                        ))}
                    </div>
                    <div className="px-5 pt-5">
                        <p className="font-medium text-gray-800 pb-2">Price Range</p>
                        {priceRanges.map((range, index) => (
                            <CheckBox key={index} label={`$${range}`} />
                        ))}
                    </div>
                    <div className="px-5 pt-5 pb-7" >
                        <p className="font-medium text-gray-800 pb-2">Sort By</p>
                        {sortOptions.map((option, index) => (
                            <RadioButton key={index} label={option} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllRooms;