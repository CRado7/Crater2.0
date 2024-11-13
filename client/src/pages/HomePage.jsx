import Banner from '../assets/Homepage.png';
import Crater from '../assets/craterSnnowboards.svg';
import ToTop from '../assets/to-top.svg';
import about from '../assets/about.png';
import React from 'react';
import technologyData from '../data/technologyData';
import '../styles/HomePage.css';

import FeaturedProducts from '../components/FeaturedProducts';

export default function HomePage() {
    return (
        <div className="homepage">

            <section className="hero">
                <img src={Banner} alt="HomePage" className="banner" />
                <img src={Crater} alt="Crater" className="crater" />
                <h2 className="tagline">Go Beyond The Boundries</h2>
                <a href="#featured-products"><img src={ToTop} alt="ToTop" className="toTop"/></a>
            </section>

            <section className="featured-products" id="featured-products">
                <FeaturedProducts />
            </section>

            <section className="about" id="about">
                <div className='about-text'>
                    <h1>About Crater</h1>
                    <p>
                    Crater was founded with a single mission: to bring the freedom and flow of surfing to the mountains. Born from a passion for backcountry snowboarding, Crater designs boards that feel at home on uncharted powder, taking inspiration from the effortless glide of a surfboard. Every snowboard we craft is engineered for riders who seek the untouched slopes and embrace the call of the wild.
                    <br />
                    <br />
                    We believe that riding should feel natural, smooth, and liberating—just like surfing a wave. That’s why our boards are designed with unique shapes and materials that enhance float and maneuverability, so you can experience pure connection with the mountain.
                    </p>
                </div>
                <div className='about-image'>
                    <img src={about} alt="mountain surfing" />
                </div>
            </section>

            <section id="technologies">
                <h1>Technologies</h1>
                <div className="technology-list">
                {technologyData.map((tech, index) => (
                    <div className="technology-item" key={index}>
                    <h2>{tech.title}</h2>
                    <p>{tech.description}</p>
                    </div>
                ))}
                </div>
            </section>

        </div>
    );
}