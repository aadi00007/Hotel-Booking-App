import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from 'cloudinary';
import Room from "../models/Room.js";

export const createRoom = async(req, res) => {
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        
        // ✅ Fixed: req.auth.userId instead of req.auth.userID
        const hotel = await Hotel.findOne({owner: req.auth.userId});
        
        if(!hotel) {
            return res.status(404).json({success: false, message: "no hotel found"});
        }

        const uploadImages = req.files.map(async(file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });
        
        const images = await Promise.all(uploadImages);
        
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images
        });
        
        res.status(201).json({success: true, message: "room created successfully"});

    } catch(error) {
        console.error('Create room error:', error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const getRooms = async(req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true}).populate('hotel').sort({createdAt: -1});
        res.json({success: true, rooms});
        
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({success: false, message: error.message});
    }
}


export const getOwnerRooms = async(req, res) => {
    try {
        // ✅ Fixed: req.auth.userId instead of req.auth.userID
        const hotelData = await Hotel.findOne({owner: req.auth.userId});
        
        if (!hotelData) {
            return res.status(404).json({success: false, message: "Hotel not found"});
        }
        
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel");
        res.json({success: true, rooms});
        
    } catch (error) {
        console.error('Get owner rooms error:', error);
        // ✅ Fixed: "false" instead of "flase"
        res.status(500).json({success: false, message: error.message});
    }
}

export const toggleRoomAvailability = async(req, res) => {
    try {
        const {roomId} = req.body;
        const roomData = await Room.findById(roomId);
        
        if (!roomData) {
            return res.status(404).json({success: false, message: "Room not found"});
        }
        
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        
        res.json({success: true, message: "room availability updated"});
        
    } catch (error) {
        console.error('Toggle availability error:', error);
        res.status(500).json({success: false, message: error.message});
    }
}
