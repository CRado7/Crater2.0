import React, { useRef } from 'react';
import ApparelCard from './ApparelCard';
import SnowboardCard from './SnowboardCard';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_SNOWBOARDS, GET_FEATURED_APPAREL } from '../utils/queries';
import '../styles/FeaturedProducts.css';

export default function FeaturedProducts() {
    const { loading: loadingSnowboards, error: errorSnowboards, data: dataSnowboards } = useQuery(GET_FEATURED_SNOWBOARDS);
    const { loading: loadingApparel, error: errorApparel, data: dataApparel } = useQuery(GET_FEATURED_APPAREL);

    const scrollContainerRef = useRef(null);

    if (loadingSnowboards || loadingApparel) return <p>Loading...</p>;
    if (errorSnowboards || errorApparel) return <p>Error loading featured products</p>;

    const featuredSnowboards = dataSnowboards?.getFeaturedSnowboards || [];
    const featuredApparel = dataApparel?.getFeaturedApparel || [];

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -300 : 300; // Adjust scroll amount as needed
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="featured-products">
            <h1>Featured Products</h1>
            <div className="scroll-buttons">
                <button onClick={() => scroll('left')} className="scroll-button left">◀</button>
                <div className="products-scroll-container" ref={scrollContainerRef}>
                    {featuredSnowboards.map((snowboard) => (
                        <SnowboardCard key={snowboard._id} snowboard={snowboard} className="featured" />
                    ))}
                    {featuredApparel.map((apparel) => (
                        <ApparelCard key={apparel._id} apparel={apparel} className="featured" />
                    ))}
                </div>
                <button onClick={() => scroll('right')} className="scroll-button right">▶</button>
            </div>
        </div>
    );
}
