import express from 'express';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city, email } = req.body;
        
        // Get owner from authenticated user (set by protect middleware)
        const owner = req.user.clerkId;
        
        console.log('Hotel registration attempt:', { name, address, contact, city, email, owner });

        // Check if required fields are provided
        if (!name || !address || !contact || !city) {
            return res.status(400).json({
                success: false, 
                message: "All fields (name, address, contact, city) are required"
            });
        }

        // Check if user already has a hotel registered
        const existingHotel = await Hotel.findOne({ owner });
        
        if (existingHotel) {
            return res.status(400).json({
                success: false, 
                message: "You have already registered a hotel"
            });
        }

        // Create new hotel
        const hotel = await Hotel.create({
            name,
            address,
            contact,
            city,
            email: email || '', // Optional field
            owner
        });

        // Update user role to hotelOwner
        await User.findOneAndUpdate(
            { clerkId: owner }, 
            { role: "hotelOwner" },
            { new: true }
        );

        console.log('Hotel registered successfully:', hotel._id);

        res.status(201).json({
            success: true, 
            message: "Hotel registered successfully",
            hotel: {
                id: hotel._id,
                name: hotel.name,
                city: hotel.city
            }
        });

    } catch (error) {
        console.error('Hotel registration error:', error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}
