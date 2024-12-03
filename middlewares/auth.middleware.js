const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const BlacklistModel = require("../models/blacklist.model");

module.exports.isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isTokenBlacklisted = await BlacklistModel.findOne({ token });
        if (isTokenBlacklisted) {
            return res.status(400).json({ message: "Token is blacklisted" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded._id);
        req.user = user;
        next();
    } catch (error) {
        
    }
}
module.exports.isSeller = async (req, res, next) => {
   try {
    if (req.user.role !== "seller") {
        return res.status(400).json({ message: "User is not a seller" });
        }
        next();
    } catch (error) {
        
   }
}