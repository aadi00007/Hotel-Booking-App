import { populate } from "dotenv";
import Booking from "../models/bookings"
import Hotel from "../models/Hotel";
import Room from "../models/Room";



const checkAvailability  = async({checkInDate, checkOutDate, room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte : checkOutDate},
            checkOutDate:{$gte: checkInDate}
        });
        const isAvailable=  bookings.length === 0;
        return isAvailable;
        
    } catch (error) {
        console.log(error.message)
        
    }

}

export const checkAvailabilityAPI = async(req,res)=>{
    try {
        const {room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate,checkOutDate,room});
        res.json({success: true, isAvailable})
    } catch (error) {
        res.json({success:false, message: error.message})
        
    }
}

export const createBooking = async(req,res)=>{
    try {
        const {room, checkInDate, checkOutDate, guestes} = req.body;
        const user = req.user._id

        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        })

        if(!isAvailable){
            res.json({success: false, message: "room isn't available"})
        }

        const roomData = await Room.findById(room).populate("hotel");

        let totalPrice = roomData.pricePerNight;


        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff/(1000*3600*24));
        totalPrice *= nights;
        
        
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guestes: +guestes,
            checkInDate,
            checkOutDate,
            totalPrice,


        })

        res.json({success: true, message: "booking created successfully"})
    } catch (error) {
                res.json({success: flase, message: "failed"})

        
    }
}

export const getUserBookings = async(req,res)=>{

    try {
        const user = req.user._id
        const bookings  = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})
        res.json({success:true,  bookings})
        
    } catch (error) {
                res.json({success:false,  message: "failed to fetch bookings"})

        
    }
}


export const getHotelBookings = async(req,res)=>{

    try {
        const hotel = await Hotel.findOne({owner: req.auth.userId})

    if(!hotel){
        return                 res.json({success:false,  message: "no hotel found"})

    }
    const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({createdAt: -1})

    const totalBookings = bookings.length

    const totalRevenue = bookings.reduce((acc, booking)=>acc + booking.totalPrice,0)

    res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}})
        
    } catch (error) {
            res.json({success: false, message:"failed to fetch bookings"})

        
    }
}

