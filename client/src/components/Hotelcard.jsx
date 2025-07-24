import React from "react";
import { Link } from "react-router-dom";
import assets from "../assets/assets";
const HotelCard = ({room, index})=>{
    return(
       <Link to={'/rooms/' + room._id} onClick={()=> scrollTo(0,0)} key={room._id} className="relative max-w-sm w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-md">
        <img src={room.images[0]} alt={`${room.hotel.name} image`} className="w-full h-48 object-cover rounded-t-xl" />
           {index%2===0 && <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">Best Seller</p>}
        <div className="flex flex-col p-4 gap-2">
            <p className="font-playfair text-xl font-medium text-gray-800"> {room.hotel.name}</p>
            <div className="flex items-center gap-1">
                <img src={assets.starIconFilled} alt="Star rating icon" className="h-5" /> 4.5
            </div>
            <div className="flex items-center gap-2">
                <img src={assets.locationIcon} alt="Location icon" className="h-5" />
                <span className="text-gray-600">{room.hotel.address} </span>
            </div>
            <div className="flex items-center justify-between mt-2">
                <p> <span className="text-xl text-gray-800"> ${room.pricePerNight} </span><span className="text-gray-600">/night</span> </p>
                <button className="px-4 py-2 text-sm font-medium text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer">Book Now</button>
            </div>
        </div>
       </Link>
    )
}
export default HotelCard