import {Component} from 'react'
import {
  FaPinterestSquare,
  FaInstagram,
  FaTwitter,
  FaFacebookSquare,
} from 'react-icons/fa'

import './index.css'

export default function Footer() {
  return (
    <div className="footer-container">
      <div className="sub-footer">
        <img
          src="https://res.cloudinary.com/datntizra/image/upload/v1765198946/Vector_hjm4bz.png"
          className="footer-kitchen-logo"
          alt="website-footer-logo"
        />
        <h1 className="footer-heading">Tasty Kitchens</h1>
      </div>
      <p className="footer-description">
        The only thing we are serious about is food. Contact us on
      </p>
      <div className="footer-logos-container">
        <FaPinterestSquare
          testid="pintrest-social-icon"
          className="contact-logos"
        />
        <FaInstagram testid="instagram-social-icon" className="contact-logos" />
        <FaTwitter testid="twitter-social-icon" className="contact-logos" />
        <FaFacebookSquare
          testid="facebook-social-icon"
          className="contact-logos"
        />
      </div>
    </div>
  )
}
