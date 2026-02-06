import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
    try {
        const auth = req.auth();
        
        const clerkId = auth.userId; 

        if (!clerkId) {
            return res.status(401).json({ message: "Unauthorized - No Clerk ID found" });
        }

        const user = await User.findOne({ clerkId }); // This works now because clerkId is defined
        
        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}