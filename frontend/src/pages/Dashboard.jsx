import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scheduleAPI, moodAPI } from '../utils/api';
import { formatDate, getDayName } from '../utils/helpers';
import TodaySchedule from '../components/dashboard/TodaySchedule';
import WeeklySummary from '../components/dashboard/WeeklySummary';
import BurnoutIndicator from '../components/dashboard/BurnoutIndicator';
import { Heart, Plus } from 'lucide-react';
import './Dashboard.css';


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [moods, setMoods] = useState([]);
  const [todayMood, setTodayMood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedulesRes, moodsRes, todayMoodRes] = await Promise.all([
        scheduleAPI.getAll(),
        moodAPI.getWeek(),
        moodAPI.getToday(),
      ]);

      setSchedules(schedulesRes.data);
      setMoods(moodsRes.data);
      setTodayMood(todayMoodRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name}! 👋</h1>
          <p className="page-subtitle">
            {formatDate(new Date())} • {getDayName()}
          </p>
        </div>
        <div className="page-actions">
          <button 
            onClick={() => navigate('/schedule')} 
            className="btn btn-primary"
          >
            <Plus size={20} />
            Add Schedule
          </button>
          {!todayMood && (
            <button 
              onClick={() => navigate('/mood')} 
              className="btn btn-accent"
            >
              <Heart size={20} />
              Check-in Mood
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <TodaySchedule schedules={schedules} />
          <WeeklySummary schedules={schedules} />
        </div>
        <div className="dashboard-sidebar">
          <BurnoutIndicator schedules={schedules} moods={moods} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;