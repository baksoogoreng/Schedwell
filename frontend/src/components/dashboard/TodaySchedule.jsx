import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { getTodaySchedules, sortSchedulesByTime } from '../../utils/helpers';
import './Dashboard.css';

const TodaySchedule = ({ schedules }) => {
  const todaySchedules = sortSchedulesByTime(getTodaySchedules(schedules));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <Calendar size={24} />
          Today's Schedule
        </h3>
      </div>

      <div className="schedule-list">
        {todaySchedules.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} className="empty-icon" />
            <p className="empty-text">No schedules for today</p>
            <p className="empty-subtext">Enjoy your free day! 🎉</p>
          </div>
        ) : (
          todaySchedules.map((schedule) => (
            <div key={schedule._id} className="schedule-item slide-in">
              <div 
                className="schedule-color" 
                style={{ backgroundColor: schedule.color }}
              />
              <div className="schedule-content">
                <div className="schedule-header">
                  <h4 className="schedule-title">{schedule.title}</h4>
                  <span className={`badge badge-${schedule.type}`}>
                    {schedule.type}
                  </span>
                </div>
                <div className="schedule-meta">
                  <span className="schedule-time">
                    <Clock size={14} />
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                  {schedule.location && (
                    <span className="schedule-location">
                      <MapPin size={14} />
                      {schedule.location}
                    </span>
                  )}
                </div>
                {schedule.description && (
                  <p className="schedule-description">{schedule.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;