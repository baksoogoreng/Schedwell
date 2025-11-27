// src/components/insights/InsightCards.jsx
import React from 'react';
import './InsightCards.css'; // Import the CSS for the card styles

const InsightCards = ({ insights }) => {
  return (
    <div className="insight-cards-container">
      {insights.map((insight, index) => (
        <div key={index} className="insight-card">
          <h3 className="insight-card-title">{insight.title}</h3>
          <p className="insight-card-description">{insight.description}</p>
          {/* You can add more information or graphs here as needed */}
        </div>
      ))}
    </div>
  );
};

export default InsightCards;