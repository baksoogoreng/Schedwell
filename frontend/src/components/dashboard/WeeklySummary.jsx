import React from 'react';
import { TrendingUp, BookOpen, Users, Clock } from 'lucide-react';
import { calculateWeeklyHours } from '../../utils/helpers';
import './Dashboard.css';

const WeeklySummary = ({ schedules }) => {
  const weeklyHours = calculateWeeklyHours(schedules);

  const stats = [
    {
      label: 'Total Hours',
      value: weeklyHours.total,
      icon: Clock,
      color: 'var(--primary)',
      bgColor: '#ffebe3',
    },
    {
      label: 'Class Hours',
      value: weeklyHours.class,
      icon: BookOpen,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      label: 'Organization Hours',
      value: weeklyHours.organization,
      icon: Users,
      color: 'var(--accent)',
      bgColor: '#d1f5f3',
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <TrendingUp size={24} />
          Weekly Summary
        </h3>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="stat-card fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="stat-icon" 
                style={{ 
                  backgroundColor: stat.bgColor,
                  color: stat.color 
                }}
              >
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}h</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="summary-footer">
        <p className="summary-text">
          {parseFloat(weeklyHours.total) > 15 ? (
            <span className="text-warning">⚠️ You're working more than 15 hours this week</span>
          ) : (
            <span className="text-success">✅ Your workload looks manageable</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default WeeklySummary;