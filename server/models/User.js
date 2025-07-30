import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    clerkId: {
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    username: {
        type: String, 
        required: false
    },
    email: {
        type: String, 
        required: false,  // ✅ Changed to false
        unique: true,
        sparse: true,     // ✅ Allows multiple empty values
        index: true
    },
    image: {
        type: String, 
        required: false,
        default: ""
    },
    role: {
        type: String, 
        enum: ["user", "hotelOwner"],
        default: "user"
    },
    recentSearchedCities: [{
        type: String
    }],
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    lastClerkSync: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    _id: true
});

// Create indexes for better performance
userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });

// Helper method to sync user data from Clerk
userSchema.methods.syncWithClerk = function(clerkUserData) {
    this.email = clerkUserData.emailAddresses?.[0]?.emailAddress || this.email;
    this.firstName = clerkUserData.firstName || this.firstName;
    this.lastName = clerkUserData.lastName || this.lastName;
    this.username = clerkUserData.username || this.username;
    this.image = clerkUserData.imageUrl || this.image;
    this.lastClerkSync = new Date();
    return this;
};

const User = mongoose.model("User", userSchema);
export default User;
