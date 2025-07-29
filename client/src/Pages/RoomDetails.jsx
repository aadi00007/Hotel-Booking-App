import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import assets, { dashboardDummyData, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRatings";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
    const { id } = useParams();
    const {rooms, getToken, axios, navigate} = useAppContext()
    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [checkInDate, setcheckInDate] = useState(null)
     const [checkOutDate, setcheckOutDate] = useState(null)
  const [guests, setguests] = useState(1)
    const [isAvailable, setisAvailable] = useState(false)

    const checkAvailability = async()=>{
        try {
            if(checkInDate >= checkOutDate){
                toast.error('CheckIn date should be less than checkout date')
                return
            }
            const{data} = await axios.post('/api/bookings/check-availability', {room: id, checkInDate, checkOutDate})
            if(data.success){
                if(data.isAvailable){
                    setisAvailable(true)
                    toast.success('Room is available')
                }
                else{
                    setisAvailable(false)
                    toast.error('Rooms is not available')
                }
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

            
        }
    }

    const onSubmitHandler = async()=>{
        try {
            e.preventDefault();
            if(!isAvailable){
                return checkAvailability();
            }
            else{
                const {data}= await axios.post('/api/bookings/book', {room: id, checkInDate,checkOutDate,guests, paymentMethod :"Pay at hotel"},
                    {headers: {Authorization: `Bearer ${await getToken()}`}})
                    if(data.success){
                        toast.success(data.message)
                        navigate('/my-bookings')
                        scrollTo(0,0)
                    }
                    else{
                        toast.error(data.message)
                    }
            }

            
        } catch (error) {
            toast.error(error.message)
        }
    }



   

    useEffect(() => {
        const foundRoom = rooms.find((room) => room._id === id);
        foundRoom && setRoom(foundRoom);
        foundRoom && setMainImage(foundRoom.images[0]);
    }, [rooms]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Booking submitted:", { ...formData, roomId: id });
        // Add booking logic here (e.g., API call)
    };

    if (!room) return <div className="py-28 px-4 md:px-16 lg:px-24 xl:px-32">Loading...</div>;

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
                         onChange={(e)=> setcheckInDate(e.target.value)} 
                         min={new Date().toISOString().split('T')[0]}

                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                </div>
                <div className="mb-4 md:mb-0">
                    <label htmlFor="checkOutDate" className="font-medium">Check-Out</label>
                    <input
                        type="date"
                        id="checkOutDate"
                        name="checkOutDate"
                         onChange={(e)=> setcheckOutDate(e.target.value)} min={checkInDate}
                         disabled={!checkInDate}

                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                </div>
                <div className="mb-4 md:mb-0">
                    <label htmlFor="guests" className="font-medium">Guests</label>
                    <input
                        type="number"
                        id="guests"
                        name="guests"
                        
                        onChange={(e)=> setguests(e.target.value)} value={guests}
                        placeholder="1"
                        min="0"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 px-6 md:px-8 py-3 text-base cursor-pointer"
                >
                  {isAvailable? 'Book Now': 'check Availability'}
                </button>
            </form>
            <div className="mt-25 space-y-4">
                {roomCommonData.map((spec, index)=>(
                    <div key={index} className="flex items-start gap-2">
                        <img src={spec.icon} alt="" className="w-6.5"/>
                        <div>
                            <p className="text-base">{spec.title} </p>
                            <p className="text-gray-500"> {spec.description} </p>
                        </div>

                    </div>

                ))}
            </div>
            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>Guests will be allocated on the ground floor according to availability.
You get a
You get a comfortable Two bedroom apartment has a true city feeling. The
price quoted is for two guest, at the guest slot please mark the number of
guests to get the exact price for groups. The Guests will be allocated
ground floor according to availability. You get the comfortable two bedroom
apartment that has a true city feeling.</p>

            </div>
            <div className=" flex flex-col items-start  gap-4">
                <div>
                    <img src={room.hotel.owner.image} alt="" className="h-14 w-14
md:h-18 md:w-18 rounded-full" />
                    <div className="flex gap-4">
                        <p>Hosted By {room.hotel.name} </p>
                        <div className="flex items-center mt-1">
                            <StarRating rating={4}/>
                            <p className="ml-2">200+ reviews</p>
                        </div>
                    </div>
                </div>

            </div>
            <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary
hover:bg-primary-dull transition-all cursor-pointer'
            >Contact Now</button>
        </div>
    );
};

export default RoomDetails;