import React, { useState } from "react";
import assets from "../assets/assets";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const HotelReg = () => {
    const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        email: "",
        contact: "",  // ✅ Added missing field
        city: "",     // ✅ Added missing field
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation checks
        if (!axios) {
            toast.error("API client is not available. Please check your configuration.");
            return;
        }
        if (typeof getToken !== "function") {
            toast.error("Authentication token function is not available.");
            return;
        }

        // Basic form validation - updated to include new fields
        if (!formData.name.trim() || !formData.address.trim() || !formData.email.trim() || 
            !formData.contact.trim() || !formData.city.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            const token = await getToken();
            
            if (!token) {
                toast.error("Unable to get authentication token. Please sign in again.");
                setIsLoading(false);
                return;
            }

            console.log("Submitting hotel registration...");
            console.log("Request URL:", `${axios.defaults.baseURL}/api/hotels`);
            console.log("Request Payload:", formData);

            const { data } = await axios.post(
                `/api/hotels`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (data.success) {
                toast.success(data.message || "Hotel registered successfully!");
                setIsOwner(true);
                setShowHotelReg(false);
                
                // Reset form data - updated to include new fields
                setFormData({
                    name: "",
                    address: "",
                    email: "",
                    contact: "",
                    city: "",
                });
            } else {
                toast.error(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Hotel registration error:", error);
            
            // Better error handling
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.error;
                
                if (status === 401) {
                    toast.error("Authentication failed. Please sign in again.");
                } else if (status === 403) {
                    toast.error("Not authorized to register a hotel.");
                } else if (status === 409) {
                    toast.error("Hotel with this information already exists.");
                } else if (message) {
                    toast.error(message);
                } else {
                    toast.error(`Server error (${status}). Please try again.`);
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection and try again.");
            } else {
                toast.error(error.message || "An unexpected error occurred.");
            }
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
                        className="absolute top-4 right-4 h-4 w-4 cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => setShowHotelReg(false)}
                        aria-label="Close modal"
                    />
                    <p className="text-2xl font-semibold font-playfair">Register Your Hotel</p>
                    
                    <div>
                        <label htmlFor="name" className="block font-medium mb-1">Hotel Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter hotel name"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:border-orange-500 focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="address" className="block font-medium mb-1">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter hotel address"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:border-orange-500 focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* ✅ Added City field */}
                    <div>
                        <label htmlFor="city" className="block font-medium mb-1">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Enter city"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:border-orange-500 focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* ✅ Added Contact field */}
                    <div>
                        <label htmlFor="contact" className="block font-medium mb-1">Contact Number</label>
                        <input
                            type="tel"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="Enter contact number"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:border-orange-500 focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block font-medium mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full focus:border-orange-500 focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md px-6 py-3 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
