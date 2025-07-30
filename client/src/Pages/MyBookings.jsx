import React, { useState } from "react";
import Title from "../components/Title";
import assets from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useEffect } from "react";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const {axios, getToken, user} = useAppContext();

    const fetchUserBookings = async () => {
        setLoading(true);
        try {
            console.log('Fetching user bookings...');
            
            const {data} = await axios.get('/api/bookings/user', {
                headers: { // ✅ Fixed: 'headers' instead of 'header'
                    Authorization: `Bearer ${await getToken()}`
                }
            });
            
            console.log('Bookings response:', data);
            
            if(data.success){
                setBookings(data.bookings);
                console.log('Bookings loaded:', data.bookings.length);
            } else {
                toast.error(data.message);
            }
            
        } catch (error) {
            console.error('Fetch bookings error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(user){
            fetchUserBookings();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
                <Title
                    title={'My Bookings'}
                    subtitle={'Manage all of your bookings here!'}
                    align={'left'}
                />
                <div className="text-center mt-8">
                    <p>Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
            <Title
                title={'My Bookings'}
                subtitle={'Manage all of your bookings here!'}
                align={'left'}
            />
            <div className="max-w-6xl mt-8 w-full text-gray-800">
                {bookings.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No bookings found.</p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
                            <div>Hotels</div>
                            <div>Date & Timings</div>
                            <div>Payment</div>
                        </div>
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
                            >
                                <div className="flex flex-col md:flex-row">
                                    <img
                                        src={booking.room?.images?.[0] || assets.fallbackImage}
                                        alt={`${booking.hotel?.name} image`}
                                        className="md:w-44 rounded shadow object-cover"
                                    />
                                    <div className="flex flex-col gap-1.5 max-md:mt-3 md:ml-4">
                                        <p className="font-playfair text-2xl">
                                            {booking.hotel?.name}
                                            <span className="font-inter text-sm"> ({booking.room?.roomType}) </span>
                                        </p>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <img
                                                src={assets.locationIcon || assets.fallbackImage}
                                                alt="Location icon"
                                                className="w-5 h-5"
                                            />
                                            <span>{booking.hotel?.address}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <img
                                                src={assets.guestsIcon || assets.fallbackImage}
                                                alt="Guests icon"
                                                className="w-5 h-5"
                                            />
                                            <span>Guests: {booking.guests}</span>
                                        </div>
                                        <p className="text-base">Total: ${booking.totalPrice}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:items-center gap-4 mt-3">
                                    <div>
                                        <p>Check-In:</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <p>Check-Out:</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start justify-center pt-3">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`h-3 w-3 rounded-full ${
                                                booking.isPaid ? "bg-green-500" : "bg-red-500"
                                            }`}
                                        ></div>
                                        <p
                                            className={`text-sm ${
                                                booking.isPaid ? "text-green-500" : "text-red-500"
                                            }`}
                                        >
                                            {booking.isPaid ? "Paid" : "Unpaid"}
                                        </p>
                                    </div>
                                    {!booking.isPaid && (
                                        <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
