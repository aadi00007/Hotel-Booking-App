import React, { useState } from "react";
import assets from "../assets/assets";

const HotelReg = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] = useState({
        hotelName: "",
        address: "",
        email: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Hotel registration submitted:", formData);
        setIsOpen(false); // Close modal on submit
    };

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/70">
            <form
                onSubmit={handleSubmit}
                className="relative flex bg-white rounded-xl max-w-4xl max-md:mx-2 p-6 shadow-lg"
            >
                <img
                    src={assets.regImage || assets.fallbackImage}
                    alt="Hotel registration illustration"
                    className="w-1/2 rounded-xl hidden md:block object-cover"
                />
                <div className="flex flex-col gap-4 p-6 w-full md:w-1/2">
                    <img
                        src={assets.closeIcon || assets.fallbackImage}
                        alt="Close modal"
                        className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
                        onClick={() => setIsOpen(false)}
                    />
                    <p className="text-2xl font-semibold font-playfair">Register Your Hotel</p>
                    <div>
                        <label htmlFor="hotelName" className="font-medium">Hotel Name</label>
                        <input
                            type="text"
                            id="hotelName"
                            name="hotelName"
                            value={formData.hotelName}
                            onChange={handleInputChange}
                            placeholder="Enter hotel name"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="font-medium">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter hotel address"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md px-6 py-3 text-base cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelReg;