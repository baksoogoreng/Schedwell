import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleCard from './ScheduleCard';
import ScheduleForm from './ScheduleForm';

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    // Fetch schedules when component mounts
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleEdit = (scheduleId) => {
    const scheduleToEdit = schedules.find((schedule) => schedule._id === scheduleId);
    setEditingSchedule(scheduleToEdit);
  };

  const handleDelete = async (scheduleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/schedules/${scheduleId}`);
      setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleSave = async (scheduleData) => {
    try {
      if (editingSchedule) {
        // Update existing schedule
        await axios.put(`http://localhost:5000/api/schedules/${editingSchedule._id}`, scheduleData);
      } else {
        // Create new schedule
        await axios.post('http://localhost:5000/api/schedules', scheduleData);
      }
      fetchSchedules();
      setEditingSchedule(null); // Close the form after saving
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleCancel = () => {
    setEditingSchedule(null); // Close the form without saving
  };

  return (
    <div>
      <h2>My Schedule</h2>
      <button onClick={() => setEditingSchedule({})}>Add New Schedule</button>
      <div>
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule._id}
            schedule={schedule}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {editingSchedule && (
        <ScheduleForm
          existingSchedule={editingSchedule}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ScheduleList;