import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import assets, { dashboardDummyData, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRatings.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const RoomDetails = () => {
    const { id } = useParams();
    const { rooms, getToken, axios, navigate } = useAppContext();
    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setcheckInDate] = useState('');
    const [checkOutDate, setcheckOutDate] = useState('');
    const [guests, setguests] = useState(1);
    const [isAvailable, setisAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);

    const checkAvailability = async () => {
        if (!checkInDate || !checkOutDate) {
            toast.error('Please select both check-in and check-out dates');
            return;
        }

        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            toast.error('Check-in date should be less than check-out date');
            return;
        }

        setIsLoading(true);
        try {
            // ✅ Fixed: Added authorization header
            const { data } = await axios.post('/api/bookings/check-availability', {
                room: id, 
                checkInDate, 
                checkOutDate
            }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                if (data.isAvailable) {
                    setisAvailable(true);
                    toast.success('Room is available!');
                    setShowPaymentOptions(true);
                } else {
                    setisAvailable(false);
                    toast.error('Room is not available for selected dates');
                    setShowPaymentOptions(false);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Check availability error:', error);
            toast.error(error.response?.data?.message || 'Failed to check availability');
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Fixed: Added event parameter and corrected endpoint
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!isAvailable) {
            return checkAvailability();
        }
        // If available, show payment options instead of immediately booking
        setShowPaymentOptions(true);
    };

    // Handle "Pay at Hotel" booking
    const bookWithHotelPayment = async () => {
        setIsLoading(true);
        try {
            // ✅ Fixed: Correct endpoint and parameter name
            const { data } = await axios.post('/api/bookings', {
                room: id,
                checkInDate,
                checkOutDate,
                guestes: guests, // Note: keeping the typo to match your backend
            }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });

            if (data.success) {
                toast.success('Booking created successfully! Check your email for confirmation.');
                navigate('/my-bookings');
                window.scrollTo(0, 0);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const foundRoom = rooms.find((room) => room._id === id);
        if (foundRoom) {
            setRoom(foundRoom);
            setMainImage(foundRoom.images[0]);
        }
    }, [rooms, id]);

    if (!room) return <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">Loading...</div>;

    // Calculate total price
    const calculateTotalPrice = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return nights * room.pricePerNight;
    };

    return (
        <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                <h1 className="text-3xl md:text-4xl font-playfair">
                    {room.hotel.name}
                    <span className="font-inter text-sm"> {room.roomType} </span>
                </h1>
                <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
                    {room.discount || 20}% OFF
                </p>
            </div>
            <div className="flex items-center gap-1 mt-2">
                <StarRating rating={4} />
                <p className="ml-2">{room.reviews || "200+ reviews"}</p>
            </div>
            <div className="flex items-center gap-1 text-gray-500 mt-2">
                <img src={assets.locationIcon} alt="Location icon" className="w-5 h-5" />
                <span>{room.hotel.address}</span>
            </div>
            <div className="flex flex-col lg:flex-row mt-6 gap-6">
                <div className="lg:w-1/2 w-full">
                    <img
                        src={mainImage}
                        alt={`${room.hotel.name} main image`}
                        className="w-full rounded-xl shadow-lg object-cover"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 lg:w-1/2">
                    {room.images.map((image, index) => (
                        <img
                            onClick={() => setMainImage(image)}
                            key={index}
                            src={image}
                            alt={`${room.hotel.name} thumbnail ${index + 1}`}
                            className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                                mainImage === image && 'outline outline-3 outline-orange-500'
                            }`}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col md:flex-row md:justify-between mt-10">
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-playfair">Experience Luxury</h1>
                    <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                        {room.amenities.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70">
                                <img
                                    src={facilityIcons[item] || assets.fallbackImage}
                                    alt={`${item} icon`}
                                    className="w-5 h-5"
                                />
                                <p className="text-xs">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-2xl font-medium text-gray-700">
                    ${room.pricePerNight}/night
                </p>
            </div>
            
            {/* Booking Form */}
            <form
                onSubmit={onSubmitHandler}
                className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-lg p-6 rounded-xl mx-auto mt-16 max-w-6xl"
            >
                <div className="mb-4 md:mb-0">
                    <label htmlFor="checkInDate" className="font-medium">Check-In</label>
                    <input
                        type="date"
                        id="checkInDate"
                        name="checkInDate"
                        value={checkInDate}
                        onChange={(e) => setcheckInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4 md:mb-0">
                    <label htmlFor="checkOutDate" className="font-medium">Check-Out</label>
                    <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                        value={checkOutDate}
                        onChange={(e) => setcheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split('T')[0]}
                        disabled={!checkInDate}
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4 md:mb-0">
                    <label htmlFor="guests" className="font-medium">Guests</label>
                    <input
                        type="number"
                        id="guests"
                        name="guests"
                        onChange={(e) => setguests(parseInt(e.target.value))}
                        value={guests}
                        placeholder="1"
                        min="1"
                        max="6"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        required
                    />
                </div>
                
                {!showPaymentOptions ? (
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 px-6 md:px-8 py-3 text-base cursor-pointer disabled:opacity-50"
                    >
                        {isLoading ? 'Checking...' : (isAvailable ? 'Book Now' : 'Check Availability')}
                    </button>
                ) : (
                    <div className="flex flex-col md:flex-row gap-3 max-md:w-full max-md:mt-6">
                        <button
                            type="button"
                            onClick={() => toast.info('Online payment will be available soon')}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
                        >
                            Pay Online
                        </button>
                        <button
                            type="button"
                            onClick={bookWithHotelPayment}
                            disabled={isLoading}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md disabled:opacity-50"
                        >
                            {isLoading ? 'Booking...' : 'Pay at Hotel'}
                        </button>
                    </div>
                )}
            </form>

            {/* Price Display */}
            {checkInDate && checkOutDate && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-6xl mx-auto">
                    <p className="text-lg font-medium">
                        Total: ${calculateTotalPrice()} 
                        <span className="text-sm text-gray-600 ml-2">
                            (${room.pricePerNight} × {Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))} nights)
                        </span>
                    </p>
                </div>
            )}

            {/* Rest of your existing code... */}
            <div className="mt-25 space-y-4">
                {roomCommonData.map((spec, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <img src={spec.icon} alt="" className="w-6.5" />
                        <div>
                            <p className="text-base">{spec.title}</p>
                            <p className="text-gray-500">{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>Guests will be allocated on the ground floor according to availability.
                You get a comfortable Two bedroom apartment has a true city feeling. The
                price quoted is for two guest, at the guest slot please mark the number of
                guests to get the exact price for groups. The Guests will be allocated
                ground floor according to availability. You get the comfortable two bedroom
                apartment that has a true city feeling.</p>
            </div>
            <div className="flex flex-col items-start gap-4">
                <div>
                    <img src={room.hotel?.owner?.image || assets.fallbackImage} alt="" className="h-14 w-14 md:h-18 md:w-18 rounded-full" />
                    <div className="flex gap-4">
                        <p>Hosted By {room.hotel.name}</p>
                        <div className="flex items-center mt-1">
                            <StarRating rating={4} />
                            <p className="ml-2">200+ reviews</p>
                        </div>
                    </div>
                </div>
            </div>
            <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer'>
                Contact Now
            </button>
        </div>
    );
};

export default RoomDetails;
