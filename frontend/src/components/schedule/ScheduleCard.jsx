import React from 'react';


const ScheduleCard = ({ schedule, onEdit, onDelete }) => {
  return (
    <div className="schedule-card">
      <h3>{schedule.title}</h3>
      <p>{schedule.type === 'class' ? 'Class' : 'Organization'}</p>
      <p>{schedule.day} | {schedule.startTime} - {schedule.endTime}</p>
      <p>{schedule.location}</p>
      <p>{schedule.description}</p>
      <div>
        <button onClick={() => onEdit(schedule._id)}>Edit</button>
        <button onClick={() => onDelete(schedule._id)}>Delete</button>
      </div>
    </div>
  );
};

export default ScheduleCard;