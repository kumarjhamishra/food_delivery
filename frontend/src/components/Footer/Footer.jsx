import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="" />
                <p>Delighting your taste buds since 2024. Kumar's Kitchen is your go-to source for tasty recipes and kitchen hacks. Stay in touch and follow us on social media. © 2024 Kumar's Kitchen.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>SAMPARK KARE</h2>
                <ul>
                    <li>011-2553-2553</li>
                    <li>KumarsKitchen@gmail.com</li>
                </ul>
            </div>
        </div>

        <hr />
        <p className="footer-copyright">Copyright 2024 © Kumar'sKitchen.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer