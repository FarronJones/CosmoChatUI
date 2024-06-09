// src/Dashboard.jsx
//Imports
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

//The main const Dashboard which helps you see the dashboard
const Dashboard = ({ activityData }) => {
  const [timeFrame, setTimeFrame] = useState('24h');
  const filteredData = activityData.filter(d => {
    const now = new Date();
    const dataTime = new Date(d.time);
    //Switch timeFrame thats goes into the different times
    switch (timeFrame) {
      case '24h':
        return now - dataTime <= 24 * 60 * 60 * 1000;
      case '7d':
        return now - dataTime <= 7 * 24 * 60 * 60 * 1000;
      case '30d':
        return now - dataTime <= 30 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  });
//Const data which shows data for the time and other things like user activity
  const data = {
    labels: filteredData.map(d => d.time),
    datasets: [
      {
        label: 'User Activity',
        data: filteredData.map(d => d.value),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      }
    ]
  };
//return the dashboard
  return (
    <div>
      <h2>Activity Dashboard</h2>
      <div>
        <button onClick={() => setTimeFrame('24h')}>24 Hours</button>
        <button onClick={() => setTimeFrame('7d')}>7 Days</button>
        <button onClick={() => setTimeFrame('30d')}>30 Days</button>
      </div>
      <Line data={data} />
    </div>
  );
};

//export the dashboard
export default Dashboard;