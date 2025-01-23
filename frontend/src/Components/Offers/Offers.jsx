import React from 'react'
import './Offers.css'
import ledend from '../Assets/Legend.png'
import { Link } from 'react-router-dom'
const Offers = () => {
  return (
    <div className='offers'>
    <div className="offers-left">
  <p className='down'>Clasic</p>
  <p className='down'>Collection For You</p>
  <p className='top'>ONLY ON BEST SELLERS PRODUCTS</p>
  <Link to='clasickits'><button>Check Now</button></Link>
    </div>
    <div className="offers-right">
 <img src={ledend} alt="" />
    </div>
</div>
  )
}

export default Offers