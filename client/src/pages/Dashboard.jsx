import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import AuthService from '../utils/auth';
import { GET_GENERAL_STATS, GET_SNOWBOARD_STATS, GET_APPAREL_STATS } from '../utils/queries'; // Import your queries
import AdminSnowboardCard from '../components/admin/AdminSnowboardCard'; // Import your components
import AdminApparelCard from '../components/admin/AdminApparelCard';
import AddSnowboardForm from '../components/admin/AddSnowboardForm';
import AddApparelForm from '../components/admin/AddApparelForm';

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
  const { data: snowboardData } = useQuery(GET_SNOWBOARD_STATS, {
    skip: activeTab !== 'snowboards'
  });
  const { data: apparelData } = useQuery(GET_APPAREL_STATS, {
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
      <h3>Monthly Visitors</h3>
      <ul>
        {generalData?.generalStats?.stats?.monthlyVisitors?.map((visitor) => (
          <li key={visitor.month}>{visitor.month}: {visitor.count}</li>
        )) || <li>Data not available</li>}
      </ul>
      <h3>Sales Data</h3>
      <ul>
        {generalData?.generalStats?.salesData?.map((sale) => (
          <li key={sale.month}>{sale.month} - {sale.itemType}: ${sale.total.toFixed(2)}</li>
        )) || <li>Data not available</li>}
      </ul>
      {/* Line chart placeholder */}
      <p>Line chart of total sales by month goes here</p>
    </div>
  );

  const renderSnowboardStats = () => (
    <div>
      <div>
        <h2>Snowboard Stats</h2>
        
        <h3>Sales Data</h3>
        <ul>
          {snowboardData?.salesData?.map((sale) => (
            <li key={sale.month}>{sale.month}: ${sale.total.toFixed(2)}</li>
          )) || <li>Data not available</li>}
        </ul>
    
        <h3>Most Viewed Board</h3>
        <p>
          {snowboardData?.mostViewedBoard 
            ? `Name: ${snowboardData.mostViewedBoard.name}`
            : 'Data not available'}
        </p>
    
        {/* Line chart placeholder */}
        <p>Line chart of snowboard sales by month goes here</p>
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
        
        <h3>Sales Data</h3>
        <ul>
          {apparelData?.salesData?.map((sale) => (
            <li key={sale.month}>{sale.month}: ${sale.total.toFixed(2)}</li>
          )) || <li>Data not available</li>}
        </ul>
    
        <h3>Most Viewed Item</h3>
        <p>
          {apparelData?.mostViewedApparel 
            ? `Name: ${apparelData.mostViewedApparel.name}`
            : 'Data not available'}
        </p>
    
        {/* Line chart placeholder */}
        <p>Line chart of apparel sales by month goes here</p>
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
