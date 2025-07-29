import Hotel from "../models/Hotel";
import {v2 as cloudinary} from 'cloudinary';
import Room from "../models/Room";



export const createRoom = async(req,res)=>{
try{
    const {roomType, pricePerNight, amenities} = req.body;
    const hotel = await Hotel.findOne({owner : req.auth.userID})
    if(!hotel) return res.json({success: false, message: "no hotel found"});
    

    const uploadImages = req.files.map(async(file)=>{
      const response =  await cloudinary.uploader.upload(file.path);
      return response.secure_url;

    })
     const images = await Promise.all(uploadImages)
     await Room.create({
        hotel: hotel._id,
        roomType,
        pricePerNight: +pricePerNight,
        amenities: JSON.parse(amenities),
        images
     })
     res.json({success: true, message: "room created successfully"})


}
catch(error){
    res.json({success:false, message: error.message})
}

}



export const getRooms = async(req,res)=>{
    try {
      const rooms =   await Room.find({isAvailable: true}).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({createdAt: -1})
        res.json({success:true, rooms})
        
    } catch (error) {
                res.json({success:true, message: error.message})

        
    }
    

}


export const getOwnerRooms = async(req,res)=>{
    try {
        const hotelData = await Hotel.findOne({owner: req.auth.userID})
        const rooms  = await Room.find({hotel: hotelData._id.toString()}).populate("hotel")
        res.json({success: true, rooms})
        
    } catch (error) {
                res.json({success: flase, message: error.message})

        
    }

}


export const toggleRoomAvailability = async(req,res)=>{
    try {
        const {roomId} = req.body;
        const roomData = await Room.findById(roomId)
        roomData.isAvailable = !roomData.isAvailable
        await roomData.save();
                        res.json({success: true, message: "room availability updated"})

        
    } catch (error) {
                                res.json({success: false, message: error.message})

    }
    

}