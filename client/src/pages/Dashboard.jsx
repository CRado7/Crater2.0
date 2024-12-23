import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import AuthService from '../utils/auth';
import { GET_SITE_STATS, GET_TOP_APPAREL, GET_TOP_SNOWBOARD } from '../utils/queries';
import AdminSnowboardCard from '../components/admin/AdminSnowboardCard';
import AdminApparelCard from '../components/admin/AdminApparelCard';
import AddSnowboardForm from '../components/admin/add/AddSnowboardForm';
import AddApparelForm from '../components/admin/add/AddApparelForm';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showForm, setShowForm] = useState(false);

  const { data: generalData } = useQuery(GET_SITE_STATS, { skip: activeTab !== 'general' });
  const { data: topSnowboardData } = useQuery(GET_TOP_SNOWBOARD, { variables: { limit: 1 }, skip: activeTab !== 'snowboards' });
  const { data: topApparelData } = useQuery(GET_TOP_APPAREL, { variables: { limit: 3 }, skip: activeTab !== 'apparel' });

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleAddBoardClick = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const renderSiteStats = () => {
    if (!generalData) return <p>Loading general stats...</p>;
  
    const stats = generalData.getSiteStats;
    if (!stats) return <p>No stats available.</p>;
  
    return (
      <div>
        <h2>General Stats</h2>
        <div className="stats-cards">
          {/* Card 1: Total Visitors */}
          <div className="stats-card">
            <h3>Total Site Visitors</h3>
            <p>Total Views: {stats.totalViews ?? 'Data not available'}</p>
            <p>Unique Visits: {stats.uniqueVisits ?? 'Data not available'}</p>
          </div>
        </div>
  
        {/* Monthly Stats Section */}
        <div className="monthly-stats-section">
          <h3>Monthly Stats</h3>
          {stats.monthlyStats && stats.monthlyStats.length > 0 ? (
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Total Views</th>
                  <th>Unique Visits</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthlyStats.map((monthStat, index) => (
                  <tr key={index}>
                    <td>{monthStat.year}</td>
                    <td>{new Date(0, monthStat.month).toLocaleString('default', { month: 'long' })}</td>
                    <td>{monthStat.totalViews}</td>
                    <td>{monthStat.uniqueVisits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No monthly stats available.</p>
          )}
        </div>
      </div>
    );
  };

  const renderSnowboardStats = () => (
    <div>
      <div className="viewed-section">
        <h3>Most Viewed Board</h3>
      <div className="most-viewed">
        {topSnowboardData && topSnowboardData.topSnowboardByViews && topSnowboardData.topSnowboardByViews.length > 0 ? (
          <div>
            {topSnowboardData.topSnowboardByViews[0].pictures &&
              topSnowboardData.topSnowboardByViews[0].pictures.length > 0 && (
                <img
                  src={topSnowboardData.topSnowboardByViews[0].pictures[0]}
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
      </div>

        <button className="add" onClick={handleAddBoardClick}>Add A New Board</button>
      <div className="cards">

        {/* Show the AddSnowboardForm component when showForm is true */}
        {showForm && <AddSnowboardForm closeForm={closeForm} />}
        <AdminSnowboardCard />
      </div>
    </div>
  );

  const renderApparelStats = () => (
    <div>
      <div className="viewed-section">
        <h3>Top 3 Most Viewed Items</h3>
        {topApparelData ? (
          <ul className="most-viewed">
            {topApparelData.topApparelByViews.map((item) => (
              <li key={item._id}>
                <img src={item.pictures[0]} alt={item.name} style={{ width: '50px' }} />
                <p>{item.name}</p>
                <p>Views: {item.views}</p>
                <p>Price: ${item.price}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading top apparel items...</p>
        )}
      </div>

      <button className="add" onClick={handleAddBoardClick}>Add New Apparel</button>
      <div className="cards">

        {/* Show the AddApparelForm component when showForm is true */}
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
        {activeTab === 'general' && renderSiteStats()}
        {activeTab === 'snowboards' && renderSnowboardStats()}
        {activeTab === 'apparel' && renderApparelStats()}
      </div>
    </div>
  );
};

export default AdminDashboard;
