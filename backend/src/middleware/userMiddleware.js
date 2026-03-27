import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = req.headers.authorization?.split(" ")[1]?.trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user comes from protect middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission",
      });
    }

    next();
  };
};