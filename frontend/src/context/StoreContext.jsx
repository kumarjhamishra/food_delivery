import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "https://food-delivery-backend-t1ku.onrender.com"
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([])

    const addToCart = async(itemId) => {
        if(!cartItems[itemId]){
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }

        // save in the database
        if(token){
            await axios.post(url+"/api/cart/add", {itemId}, {headers:{token}})
        }
    }

    const removeFromCart =  async(itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))

        if(token){
            await axios.post(url+"/api/cart/remove", {itemId}, {headers:{token}})
        }
    }

    const getTotalCartAmount = ()=>{
        let totalAmount  = 0;
        for(const item in cartItems){
            if(cartItems[item] > 0){
                let itemInfo = food_list.find((product)=>product._id === item);
                totalAmount += itemInfo.price* cartItems[item];
            }
        }

        return totalAmount;
    }


    // getting the food list from the database
    const fetchFoodList = async()=>{
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    // function for when we reload the page we get the cart data
    const loadCartData = async(token)=>{
        const response = await axios.post(url+"/api/cart/get", {},{headers:{token}})
        setCartItems(response.data.cartData);
    }
    

    // to ensure that when we refesh we don't get logout, our data doesn't erased from the local storage
    useEffect(()=>{
        async function loadData(){
            await fetchFoodList();
            
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }

        loadData();
        
    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
