import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import validator from "validator"

// login user
const loginUser = async (req, res)=>{
    const {email, password} = req.body;
    try {
        // check email is present in the databse
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message: "User does not exist"})
        }

        // now match the user password with the stored password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return  res.json({success:false, message: "Incorrect Password"})
        }

        // generate the token
        const token = createToken(user._id)
        res.json({success:true, token})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// generate the token
const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user
const registerUser = async(req, res)=>{
    const {name, password, email} = req.body;
    try {
        // check if the user already exist
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false, message: "User already exists"})
        }

        // validating the email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email id"})
        }

        // check the length of the password
        if(password.length < 8){
            return res.json({success:false, message: "Enter password of minimum 8 characters"})
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name, 
            email:email,
            password:hashedPassword
        })

        // save the user
        const user =  await newUser.save();
        // generate the token
        const token = createToken(user._id)
        res.json({success:true, token})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {loginUser, registerUser}