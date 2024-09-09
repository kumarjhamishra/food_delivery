import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {
    const {food_list} = useContext(StoreContext)

  return (
    <div className='food-display' id='food-display'>
        <h2>Best dishes near you</h2>
        <div className="food-display-list">
          {food_list.map((item, index)=>{
            if(category === "All" || category===item.category){
// 1:44
              return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
            }
          })}
        </div>
    </div>
  )
}

// 1:10:35
export default FoodDisplay