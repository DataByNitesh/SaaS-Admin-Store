import User from "../models/userModel.js"
import generateToken from "../utils/generateToken.js"

export const signup=async(req,res,next)=>{
 try {
    const {name,email,password}=req.body

    if(!name || !email || !password){
        return res.status(401).json({message:"All fields are required"})
    }

    const userExist= await User.findOne({email})
    if(userExist){
        return res.status(401).json({ message: "User already Exist" });
    }

    const newUser= await User.create({
        name,
        email,
        password,
    })

    const token=generateToken(newUser)

    return res.status(201).json({
        success:true,
        user:{
        id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        role:newUser.role,
    },token,})
 } catch (error) {
    next(error)  
 }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

