import React from "react";
import Title from "./Title.jsx";
import assets, { exclusiveOffers } from "../assets/assets";

const ExclusiveOffers = () => {
    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <Title title='Exclusive Offers' subtitle='These are the limited-time offers. Grab them before its too late!' align='left'/>
                <button type="button" className="group flex items-center gap-2 font-medium text-gray-800 cursor-pointer max-md:mt-4 hover:text-gray-600 transition-all">
                    View all offers
                    <img src={assets.arrowIcon} alt="Arrow icon" className="h-5 group-hover:translate-x-1 transition-all" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {exclusiveOffers.map((item) => (
                    <div key={item._id} className="group relative flex flex-col items-start justify-between gap-2 pt-12 px-4 pb-5 rounded-xl text-white bg-no-repeat bg-cover bg-center bg-black/50 max-w-sm mx-auto shadow-md" style={{ backgroundImage: `url(${item.image})` }}>
                        <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">{item.priceOff}% OFF</p>
                        <div>
                            <p className="text-2xl font-medium font-playfair">{item.title}</p>
                            <p className="text-white/90">{item.description}</p>
                            <p className="text-xs text-white/70 mt-3">Expires {item.expiryDate}</p>
                        </div>
                        <button type="button" className="flex items-center gap-2 font-medium text-white cursor-pointer hover:text-gray-200 transition-all">
                            View Offer
                            <img className="invert group-hover:translate-x-1 transition-all h-5" src={assets.arrowIcon} alt="Arrow icon"  />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExclusiveOffers;