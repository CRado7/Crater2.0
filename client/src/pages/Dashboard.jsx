import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import AuthService from '../utils/auth';
import { GET_GENERAL_STATS } from '../utils/queries'; // Import your queries
import { GET_TOP_APPAREL, GET_TOP_SNOWBOARD } from '../utils/queries';
import AdminSnowboardCard from '../components/admin/AdminSnowboardCard'; // Import your components
import AdminApparelCard from '../components/admin/AdminApparelCard';
import AddSnowboardForm from '../components/admin/add/AddSnowboardForm';
import AddApparelForm from '../components/admin/add/AddApparelForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      navigate('/login'); // Redirect to login if the user is not logged in
    }
  }, [navigate]);

  const [showForm, setShowForm] = useState(false);

  // GraphQL queries for each tab's data
  const { data: generalData } = useQuery(GET_GENERAL_STATS, {
    skip: activeTab !== 'general'
  });
  const { data: topSnowboardData } = useQuery(GET_TOP_SNOWBOARD, {
    variables: { limit: 1 },
    skip: activeTab !== 'snowboards'
  });
  const { data: topApparelData } = useQuery(GET_TOP_APPAREL, {
    variables: { limit: 3 },
    skip: activeTab !== 'apparel'
  });

  const handleAddBoardClick = () => {
    setShowForm(true); // Show the form when the button is clicked
  };

  const closeForm = () => {
    setShowForm(false); // Close the form
  };

  // Rendering functions for each tab's data
  const renderGeneralStats = () => (
    <div>
      <h2>General Stats</h2>
      <p>Total Site Visitors: {generalData?.generalStats?.stats?.totalVisitors ?? 'Data not available'}</p>
    </div>
  );

  const renderSnowboardStats = () => (
    <div>
      <div>
        <h2>Snowboard Stats</h2>
        <h3>Most Viewed Board</h3>
        {topSnowboardData && topSnowboardData.topSnowboardByViews && topSnowboardData.topSnowboardByViews.length > 0 ? (
          <div>
            {topSnowboardData.topSnowboardByViews[0].picture && topSnowboardData.topSnowboardByViews[0].picture.length > 0 && (
              <img 
                src={topSnowboardData.topSnowboardByViews[0].picture[0]} // Access the first image in the array
                alt={topSnowboardData.topSnowboardByViews[0].name} 
                style={{ width: '50px' }} 
              />
            )}
            <p>Name: {topSnowboardData.topSnowboardByViews[0].name}</p>
            <p>Views: {topSnowboardData.topSnowboardByViews[0].views}</p>
            <p>Price: ${topSnowboardData.topSnowboardByViews[0].price}</p>
          </div>
        ) : (
          <p>Loading top board...</p>
        )}
      </div>


      <div className="cards">
        <button onClick={handleAddBoardClick}>Add A New Board</button>

        {/* Show the AddSnowboardForm component when showForm is true */}
        {showForm && <AddSnowboardForm closeForm={closeForm} />}
        <AdminSnowboardCard />
      </div>
    </div>
  );  

  const renderApparelStats = () => (
    <div>
      <div>
        <h2>Apparel Stats</h2>
        <h3>Top 3 Most Viewed Items</h3>
        {topApparelData ? (
          <ul>
            {topApparelData.topApparelByViews.map((item) => (
              <li key={item._id}>
                <img src={item.pictures[0]} alt={item.name} style={{ width: '50px' }} />
                <p>Name: {item.name}</p>
                <p>Views: {item.views}</p>
                <p>Price: ${item.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading top apparel items...</p>
        )}
      </div>

      <div className="cards">
        <button onClick={handleAddBoardClick}>Add New Apparel</button>

        {/* Show the AddSnowboardForm component when showForm is true */}
        {showForm && <AddApparelForm closeForm={closeForm} />}
        <AdminApparelCard />
      </div>
    </div>
  );
  

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('general')}>General</button>
        <button onClick={() => setActiveTab('snowboards')}>Snowboards</button>
        <button onClick={() => setActiveTab('apparel')}>Apparel</button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'general' && renderGeneralStats()}
        {activeTab === 'snowboards' && renderSnowboardStats()}
        {activeTab === 'apparel' && renderApparelStats()}
      </div>
    </div>
  );
};

export default AdminDashboard;
