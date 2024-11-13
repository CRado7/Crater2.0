import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_APPAREL } from '../utils/queries';
import ApparelCard from '../components/ApparelCard';
import '../styles/ProductPage.css';

export default function ApparelPage() {
  const { loading, error, data } = useQuery(GET_ALL_APPAREL);

  // Debugging: log loading, error, and data
  useEffect(() => {
    if (loading) console.log("Loading apparel data...");
    if (error) console.error("Error fetching apparel data:", error);
    if (data) console.log("Apparel data received:", data);
  }, [loading, error, data]);

  if (loading) return <p>Loading apparel...</p>;
  if (error) return <p>Error loading apparel: {error.message}</p>;

  const apparelItems = data?.getAllApparel || []; // Handle potential undefined data

  return (
    <div className="product-page">
      <h1>Our Apparel</h1>
      <div className="product-grid">
        {apparelItems.map((item) => (
          <ApparelCard key={item._id} apparel={item} />
        ))}
      </div>
    </div>
  );
}
