import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: String, // Clerk user ID (string)
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Room", 
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Hotel", 
        required: true
    },
    checkInDate: {
        type: Date, 
        required: true
    },
    checkOutDate: {
        type: Date, 
        required: true
    },
    totalPrice: {
        type: Number, 
        required: true,
        min: 0
    },
    guestes: { // Note: keeping the typo to match your controller
        type: Number, 
        required: true,
        min: 1,
        default: 1
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending" // ✅ Fixed: string instead of array
    },
    paymentMethod: {
        type: String,
        enum: ["pay at hotel", "pay online"],
        required: true,
        default: "pay at hotel"
    },
    isPaid: {
        type: Boolean, 
        default: false
    }
}, {
    timestamps: true
});

// Add indexes for better performance
bookingSchema.index({ user: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ hotel: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
