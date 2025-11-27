import React, { useState, useEffect } from 'react';
import InsightCards from '../components/insights/InsightCards';
import axios from 'axios';
import './Insight.css';

const Insights = () => {
  const [insights, setInsights] = useState([
    {
      title: 'Total Tasks Completed',
      description: 'Track how many tasks you have completed this week, broken down by organization and academic tasks.',
    },
    {
      title: 'Stress Level Trends',
      description: 'See how your stress level changes over time and check if it correlates with your workload.',
    },
    {
      title: 'Mood vs Productivity',
      description: 'Analyze if there’s a relationship between your mood and your overall productivity.',
    },
  ]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    const response = await axios.get('your-api-endpoint-here');
    setInsights(response.data);
  };

  return (
    <div className="insights-container">
      <h2 className="insights-title">Insights</h2>
      <InsightCards insights={insights} />
    </div>
  );
};

export default Insights;