import React from 'react';
import { Link } from 'react-router-dom';
import Facebook from '../assets/facebook.svg';
import Instagram from '../assets/instagram.svg';
import X from '../assets/x.svg';
import '../styles/Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2>Crater</h2>
                    <p>Explore the mountain like never before with Crater's backcountry-inspired snowboards, designed to bring the flow of surfing to powder.</p>
                </div>

                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/snowboards"><li>Snowboards</li></Link>
                        <Link to="/apparel"><li>Apparel</li></Link>
                        <Link to="/contact"><li>Contact</li></Link>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h2>Contact Us</h2>
                    <p>Email: info@cratersnowboards.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <div className="socials">
                        <a href="#"><img src={Facebook} alt="Facebook" /></a>
                        <a href="#"><img src={Instagram} alt="Instagram" /></a>
                        <a href="#"><img src={X} alt="Twitter" /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Crater. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
