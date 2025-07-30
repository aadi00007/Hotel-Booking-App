import User from '../models/User.js';

export const getUserData = async (req, res) => {
    try {
        console.log('getUserData called, req.user:', req.user);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        
        res.json({
            success: true, 
            role, 
            recentSearchedCities,
            userId: req.user.clerkId,
            email: req.user.email || '',
            username: req.user.username || ''
        });
        
    } catch (error) {
        console.error('getUserData error:', error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}

export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        
        if (!recentSearchedCity) {
            return res.status(400).json({
                success: false,
                message: 'City name is required'
            });
        }

        // Find the user in database and update
        const user = await User.findOne({ clerkId: req.user.clerkId });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove city if it already exists (to avoid duplicates)
        user.recentSearchedCities = user.recentSearchedCities.filter(
            city => city !== recentSearchedCity
        );

        // Add to beginning of array
        user.recentSearchedCities.unshift(recentSearchedCity);

        // Keep only last 3 cities
        if (user.recentSearchedCities.length > 3) {
            user.recentSearchedCities = user.recentSearchedCities.slice(0, 3);
        }

        await user.save();
        
        res.json({
            success: true, 
            message: "City added",
            recentSearchedCities: user.recentSearchedCities
        });
        
    } catch (error) {
        console.error('storeRecentSearchedCities error:', error);
        res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}
