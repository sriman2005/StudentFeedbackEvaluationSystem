import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import "./GeneralFeedbackAdmin.css"

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [hostelData, setHostelData] = useState(null);
  const [canteenData, setCanteenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    fetchDashboardData();
    fetchHostelData();
    fetchCanteenData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/feedback/all');
      const data = await response.json();
      
      // Process dashboard data
      const processedData = {
        totalResponses: data.length,
        hostelerCount: data.filter(item => item.isHosteler).length,
        dayScholarCount: data.filter(item => !item.isHosteler).length,
        departmentStats: data.reduce((acc, item) => {
          acc[item.department] = (acc[item.department] || 0) + 1;
          return acc;
        }, {}),
        recentFeedback: data.slice(-5).reverse()
      };

      setDashboardData(processedData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchHostelData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/feedback/all');
      const data = await response.json();
      
      // Filter only hostel data
      const hostelResponses = data.filter(item => item.isHosteler);
      
      // Process hostel data
      const processedHostelData = {
        roomCondition: hostelResponses.reduce((acc, item) => {
          acc[item.roomCondition] = (acc[item.roomCondition] || 0) + 1;
          return acc;
        }, {}),
        hostelFood: hostelResponses.reduce((acc, item) => {
          acc[item.hostelFood] = (acc[item.hostelFood] || 0) + 1;
          return acc;
        }, {})
      };

      setHostelData(processedHostelData);
    } catch (error) {
      console.error('Error fetching hostel data:', error);
    }
  };

  const fetchCanteenData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/feedback/all');
      const data = await response.json();
      
      // Process canteen data
      const processedCanteenData = {
        foodQuality: data.reduce((acc, item) => {
          acc[item.foodQuality] = (acc[item.foodQuality] || 0) + 1;
          return acc;
        }, {}),
        canteenPricing: data.reduce((acc, item) => {
          acc[item.canteenPricing] = (acc[item.canteenPricing] || 0) + 1;
          return acc;
        }, {})
      };

      setCanteenData(processedCanteenData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching canteen data:', error);
      setLoading(false);
    }
  };

  const formatDataForPieChart = (data) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value
    }));
  };

  const formatDataForBarChart = (data) => {
    return Object.entries(data).map(([rating, count]) => ({
      rating,
      count
    }));
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'hostel' ? 'active' : ''}`}
          onClick={() => setActiveTab('hostel')}
        >
          Hostel Analytics
        </button>
        <button 
          className={`tab-button ${activeTab === 'canteen' ? 'active' : ''}`}
          onClick={() => setActiveTab('canteen')}
        >
          Canteen Analytics
        </button>
      </div>

      {activeTab === 'overview' && dashboardData && (
        <div className="overview-section">
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Responses</h3>
              <p>{dashboardData.totalResponses}</p>
            </div>
            <div className="stat-card">
              <h3>Hostelers</h3>
              <p>{dashboardData.hostelerCount}</p>
            </div>
            <div className="stat-card">
              <h3>Day Scholars</h3>
              <p>{dashboardData.dayScholarCount}</p>
            </div>
          </div>

          <div className="chart-section">
            <h3>Department-wise Responses</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={formatDataForPieChart(dashboardData.departmentStats)}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {formatDataForPieChart(dashboardData.departmentStats).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="recent-feedback">
            <h3>Recent Feedback</h3>
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Department</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentFeedback.map((feedback, index) => (
                  <tr key={index}>
                    <td>{feedback.studentId}</td>
                    <td>{feedback.department}</td>
                    <td>{new Date(feedback.submissionDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'hostel' && hostelData && (
        <div className="hostel-analytics">
          <h2>Hostel Facilities Analysis</h2>
          <div className="charts-grid">
            <div className="chart-container">
              <h3>Room Condition Ratings</h3>
              <BarChart width={400} height={300} data={formatDataForBarChart(hostelData.roomCondition)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </div>
            <div className="chart-container">
              <h3>Food Quality Ratings</h3>
              <BarChart width={400} height={300} data={formatDataForBarChart(hostelData.hostelFood)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'canteen' && canteenData && (
        <div className="canteen-analytics">
          <h2>Canteen Analysis</h2>
          <div className="charts-grid">
            <div className="chart-container">
              <h3>Food Quality Ratings</h3>
              <BarChart width={400} height={300} data={formatDataForBarChart(canteenData.foodQuality)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </div>
            <div className="chart-container">
              <h3>Pricing Satisfaction</h3>
              <BarChart width={400} height={300} data={formatDataForBarChart(canteenData.canteenPricing)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;