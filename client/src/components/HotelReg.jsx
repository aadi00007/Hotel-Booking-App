import React, { useState } from "react";
import assets from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
    const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        email: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    // Debug both axios and getToken
    console.log("Axios instance:", axios);
    console.log("getToken function:", getToken);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!axios) {
            toast.error("API client is not available. Please check your configuration.");
            return;
        }
        if (typeof getToken !== "function") {
            toast.error("Authentication token function is not available.");
            return;
        }

        setIsLoading(true);
        try {
            const token = await getToken();
            console.log("Request URL:", `${axios.defaults.baseURL}/api/hotels`);
            console.log("Request Payload:", formData);
            console.log("Request Headers:", { Authorization: `Bearer ${token}` });

            const { data } = await axios.post(
                `/api/hotels`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (data.success) {
                toast.success(data.message);
                setIsOwner(true);
                setShowHotelReg(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Network error details:", error);
            toast.error(
                error.message ||
                "A network error occurred. Please check your connection or server status."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            onClick={() => setShowHotelReg(false)}
            className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/70"
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
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
                        onClick={() => setShowHotelReg(false)}
                        aria-label="Close modal"
                    />
                    <p className="text-2xl font-semibold font-playfair">Register Your Hotel</p>
                    <div>
                        <label htmlFor="name" className="font-medium">Hotel Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
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
                        disabled={isLoading}
                    >
                        {isLoading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelReg;