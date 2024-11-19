import React from 'react';
import ApparelCard from './ApparelCard';
import SnowboardCard from './SnowboardCard';
import { useQuery } from '@apollo/client';
import { GET_FEATURED_SNOWBOARDS, GET_FEATURED_APPAREL } from '../utils/queries';
import '../styles/FeaturedProducts.css';

export default function FeaturedProducts() {
    const { loading: loadingSnowboards, error: errorSnowboards, data: dataSnowboards } = useQuery(GET_FEATURED_SNOWBOARDS);
    const { loading: loadingApparel, error: errorApparel, data: dataApparel } = useQuery(GET_FEATURED_APPAREL);

    if (loadingSnowboards || loadingApparel) return <p>Loading...</p>;
    if (errorSnowboards || errorApparel) return <p>Error loading featured products</p>;

    return (
        <div className="featured-products">
            <h1>Featured Products</h1>
            <div className="products">
                {dataSnowboards?.getFeaturedSnowboards.map((snowboard) => (
                    <SnowboardCard key={snowboard._id} snowboard={snowboard} />
                ))}
                {dataApparel?.getFeaturedApparel.map((apparel) => (
                    <ApparelCard key={apparel._id} apparel={apparel} />
                ))}
            </div>
        </div>
    );
}

