import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { calculateBurnoutLevel } from '../../utils/helpers';
import './Dashboard.css';

const BurnoutIndicator = ({ schedules, moods }) => {
  const burnout = calculateBurnoutLevel(schedules, moods);

  const getLevelConfig = () => {
    switch (burnout.level) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: 'var(--danger)',
          bgColor: '#fee2e2',
          text: 'High Risk',
          message: 'You need to take a break! Your workload is overwhelming.',
        };
      case 'medium':
        return {
          icon: AlertCircle,
          color: 'var(--warning)',
          bgColor: '#fef3c7',
          text: 'Caution',
          message: 'Your schedule is getting busy. Consider reducing commitments.',
        };
      default:
        return {
          icon: CheckCircle,
          color: 'var(--success)',
          bgColor: '#d1fae5',
          text: 'Healthy',
          message: 'Your schedule looks balanced. Keep it up!',
        };
    }
  };

  const config = getLevelConfig();
  const Icon = config.icon;

  return (
    <div className="card burnout-card">
      <div className="card-header">
        <h3 className="card-title">
          <AlertTriangle size={24} />
          Burnout Indicator
        </h3>
      </div>

      <div className="burnout-content">
        <div 
          className="burnout-badge"
          style={{ 
            backgroundColor: config.bgColor,
            color: config.color 
          }}
        >
          <Icon size={48} />
          <div>
            <p className="burnout-level">{config.text}</p>
            <p className="burnout-score">Risk Score: {burnout.score}/100</p>
          </div>
        </div>

        <p className="burnout-message">{config.message}</p>

        {burnout.warnings.length > 0 && (
          <div className="warnings-list">
            <h4 className="warnings-title">⚠️ Warnings:</h4>
            <ul>
              {burnout.warnings.map((warning, index) => (
                <li key={index} className="warning-item slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="burnout-stats">
          <div className="burnout-stat">
            <span className="stat-label">Rest Days</span>
            <span className="stat-value">{burnout.restDays} days</span>
          </div>
          <div className="burnout-stat">
            <span className="stat-label">Total Load</span>
            <span className="stat-value">{burnout.totalHours}h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnoutIndicator;