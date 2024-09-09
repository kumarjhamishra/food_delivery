import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"; // handles all the payment operations

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: true,
    });

    await newOrder.save();
    // After placing order, clear the cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        // For rupees, multiply by 100
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        // For rupees, multiply by 100
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    // Create a session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    console.log("New Order ID: ", newOrder._id);
    res.json({ success: true, orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const success = true;
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    res.json({ success: true, message: "Paid" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// User orders for frontend
const userOrders = async (req, res) => {
  try {
    // Find all the orders of the user
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({success: false, message: "Error" });
  }
}

// listing orders for admin panel
const listOrders = async(req, res)=>{
  try {
    const orders = await orderModel.find({});
    res.json({success:true, data:orders});
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
  }
}

// api for updating order status
const updateStatus = async(req, res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
    res.json({success:true, message:"Status Updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus};
