import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://satyam06kumar09:password2004@cluster0.jvacu.mongodb.net/food-del').then(()=>console.log("DB connected"));
}