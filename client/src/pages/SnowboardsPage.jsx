import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_SNOWBOARDS } from '../utils/queries';
import SnowboardCard from '../components/SnowboardCard';

export default function SnowboardsPage() {
  const { loading, error, data } = useQuery(GET_ALL_SNOWBOARDS);

  // Debugging: log loading, error, and data
  useEffect(() => {
    if (loading) console.log("Loading snowboards data...");
    if (error) console.error("Error fetching snowboards data:", error);
    if (data) console.log("Snowboards data received:", data);
  }, [loading, error, data]);

  if (loading) return <p>Loading apparel...</p>;
  if (error) return <p>Error loading snowboards: {error.message}</p>;

  const snowboardItems = data?.getAllSnowboards || []; // Handle potential undefined data

  return (
    <div className="snowboards-page">
      <h1>Our Boards</h1>
      <div className="snowboards-grid">
        {snowboardItems.map((item) => (
          <SnowboardCard key={item._id} snowboard={item} />
        ))}
      </div>
    </div>
  );
}