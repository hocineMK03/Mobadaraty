

const { User } = require("../models/User");

const verifyAssociation = async (req, res, next) => {
    try {
        if (!req.user || !req.user.user) {
            return res.status(401).json({ status: "fail", message: "Unauthorized: No user data found" });
        }

        // Find user in the database
        const user = await User.findOne({ email: req.user.user });
        
        if (!user || user.role !== "association") {
            return res.status(403).json({ status: "fail", message: "Unauthorized: Not an association" });
        }

        
        next();
    } catch (error) {
        console.error("Error in verifyAssociation:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

module.exports = verifyAssociation;
