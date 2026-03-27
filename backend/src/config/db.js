import mongoose from "mongoose";

const connectDB=async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DataBase Connected")
    } catch (error) {
        console.error(error)
        process.exit()
    }
}

export default connectDB