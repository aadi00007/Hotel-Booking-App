import Booking from "../models/Bookings.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import transporter from "../config/nodemailer.js";
import SibApiV3Sdk from '@getbrevo/brevo';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const checkAvailability = async({checkInDate, checkOutDate, room}) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate}
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
        
    } catch (error) {
        console.log(error.message);
        return false; // Return false on error
    }
}

export const checkAvailabilityAPI = async(req, res) => {
    try {
        const {room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.json({success: true, isAvailable});
    } catch (error) {
        console.error('Check availability API error:', error);
        res.status(500).json({success: false, message: error.message});
    }
}

// In controllers/bookingController.js
export const createBooking = async(req, res) => {
    try {
        console.log('🚀 Booking creation started');
        const {room, checkInDate, checkOutDate, guestes} = req.body;
        const user = req.user.clerkId;

        // Validate required fields
        if (!room || !checkInDate || !checkOutDate || !guestes) {
            return res.status(400).json({
                success: false, 
                message: "Missing required fields"
            });
        }

        // Check availability
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });

        if(!isAvailable){
            return res.status(400).json({
                success: false, 
                message: "Room isn't available"
            });
        }

        const roomData = await Room.findById(room).populate("hotel");
        if (!roomData) {
            return res.status(404).json({
                success: false, 
                message: "Room not found"
            });
        }

        // Calculate total price
        let totalPrice = roomData.pricePerNight;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff/(1000*3600*24));
        totalPrice *= nights;
        
        // Create booking
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guestes: +guestes,
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        // Send email using Brevo API (not SMTP)
        try {
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
            sendSmtpEmail.to = [{email: req.user.email, name: req.user.username}];
            sendSmtpEmail.sender = {email: process.env.SENDER_EMAIL, name: 'Hotel Booking'};
            sendSmtpEmail.subject = 'Hotel Booking Confirmation';
            sendSmtpEmail.htmlContent = `
                <h2>Your Booking Details</h2>
                <p>Dear ${req.user.username || 'Guest'},</p>
                <p>Here are your booking details:</p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                    <li><strong>Check-in:</strong> ${new Date(booking.checkInDate).toDateString()}</li>
                    <li><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toDateString()}</li>
                    <li><strong>Total:</strong> $${booking.totalPrice}</li>
                </ul>
                <p>Thank you for choosing us!</p>
            `;

            await apiInstance.sendTransacEmail(sendSmtpEmail);
            console.log('✅ Email sent successfully via API!');
        } catch (emailError) {
            console.error('❌ Email failed but booking created:', emailError);
        }

        res.status(201).json({
            success: true, 
            message: "Booking created successfully! Check your email for confirmation."
        });

    } catch (error) {
        console.error('❌ Booking creation error:', error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}



export const getUserBookings = async(req, res) => {
    try {
        const user = req.user.clerkId; // ✅ Fixed: Use clerkId consistently
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1});
        res.json({success: true, bookings});
        
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({success: false, message: "failed to fetch bookings"});
    }
}

export const getHotelBookings = async(req, res) => {
    try {
        const hotel = await Hotel.findOne({owner: req.auth.userId});

        if(!hotel){
            return res.status(404).json({success: false, message: "no hotel found"});
        }

        const bookings = await Booking.find({hotel: hotel._id})
            .populate("room hotel user")
            .sort({createdAt: -1});

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({
            success: true, 
            dashboardData: {
                totalBookings, 
                totalRevenue, 
                bookings
            }
        });
        
    } catch (error) {
        console.error('Get hotel bookings error:', error);
        res.status(500).json({success: false, message: "failed to fetch bookings"});
    }
}
