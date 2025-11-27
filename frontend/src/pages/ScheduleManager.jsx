import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleForm from '../components/schedule/ScheduleForm';

const ScheduleManager = () => {
  const [isAdding, setIsAdding] = useState(false); // Track whether we're adding a new schedule
  const [editingSchedule, setEditingSchedule] = useState(null); // Track if we're editing an existing schedule
  const [schedules, setSchedules] = useState([]); // Store fetched schedules

  // Fetch schedules from the backend
  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const response = await axios.get('http://localhost:5001/api/schedules', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      });
      setSchedules(response.data); // Set the fetched schedules to state
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  // Call fetchSchedules when the component mounts
  useEffect(() => {
    fetchSchedules();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const handleSave = async (scheduleData) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    
    try {
      // Send token in the headers with the request
      const response = await axios.post('http://localhost:5000/api/schedules', scheduleData, {
        headers: {
          Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
        },
      });

      console.log('Schedule saved:', response.data);
      fetchSchedules(); // Refetch schedules after saving
      setEditingSchedule(null); // Clear editing state
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleAddNewSchedule = () => {
    setIsAdding(true);
    setEditingSchedule(null); // Clear edit state when adding a new schedule
  };

  return (
    <div className="schedule-manager-container">
      <h2>My Schedule</h2>
      <button onClick={handleAddNewSchedule} className="btn btn-primary">
        Add New Schedule
      </button>

      {isAdding && (
        <ScheduleForm
          existingSchedule={editingSchedule}  // Pass existing schedule if editing
          onSave={handleSave}  // Pass handleSave function to ScheduleForm
        />
      )}

      {/* Render the list of schedules */}
      <div className="schedule-list">
        {schedules.map((schedule) => (
          <div key={schedule._id} className="schedule-card">
            <h3>{schedule.title}</h3>
            <p>{schedule.day}</p>
            <p>{schedule.startTime} - {schedule.endTime}</p>
            <button onClick={() => setEditingSchedule(schedule)} className="btn btn-secondary">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleManager;