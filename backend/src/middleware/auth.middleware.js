import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";

export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkid = req.auth().userId
            if (!clerkid) {
                return res.status(401).json({ message: "Unauthorized - invalid token" });
            }
            const user = await User.findOne({ clerkId: clerkid });
            if(!user) {
                return res.status(401).json({ message: "Unauthorized - user not found" });
            }
            req.user = user; // Attach the user to the request object for later use
            next();
        } catch (error) {
            console.error("Error in authentication middleware:", error);
            return res.status(401).json({ message: "Unauthorized - invalid token" });
        }
    }
]


export const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden - admin access required" });
  }
    next();
};