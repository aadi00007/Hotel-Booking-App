import express from 'express';
import Hotel from '../models/Hotel.js';
import { User } from '../models/User.js';



export const registerHotel = async(req, res)=>{
    try{
        const {name, address, contact, city}= req.body;
        const owner = req._id;

        const hotel = await Hotel.findOne({owner})

        if(owner){
            res.json({success: false, message:"User already exists"})
        }
        await Hotel.create({name, address, contact, city, owner});

        await User.findByIdAndUpdate(owner, {role: "hotelOwner"})

        res.json({success: true, message: "Hotel already registered"})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}