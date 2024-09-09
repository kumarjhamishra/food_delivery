import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique: true},
    password:{type: String, required:true},
    cartData:{type:Object, default:{}}
    // providing minimizing: false bcoz we are not providing anything in cart data
}, {minimize:false})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;