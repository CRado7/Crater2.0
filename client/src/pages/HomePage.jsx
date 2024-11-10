import Banner from '../assets/Homepage.png';
import Crater from '../assets/craterSnnowboards.svg';
import ToTop from '../assets/to-top.svg';
import React from 'react';
import '../styles/HomePage.css';

import FeaturedProducts from '../components/FeaturedProducts';

export default function HomePage() {
    return (
        <div className="homepage">

            <div className="hero">
                <img src={Banner} alt="HomePage" className="banner" />
                <img src={Crater} alt="Crater" className="crater" />
                <h1 className="tagline">Go Beyond The Boundries</h1>
                <a href="#featured-products"><img src={ToTop} alt="ToTop" className="toTop"/></a>
            </div>

            <div className="featured-products" id="featured-products">
                <FeaturedProducts />
            </div>
        </div>
    );
}