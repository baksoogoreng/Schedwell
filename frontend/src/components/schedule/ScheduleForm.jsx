import React, { useState, useEffect } from 'react';

const ScheduleForm = ({ existingSchedule, onSave }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('class');
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (existingSchedule) {
      setTitle(existingSchedule.title);
      setType(existingSchedule.type);
      setDay(existingSchedule.day);
      setStartTime(existingSchedule.startTime);
      setEndTime(existingSchedule.endTime);
      setDescription(existingSchedule.description);
      setLocation(existingSchedule.location);
    }
  }, [existingSchedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const scheduleData = {
      title,
      type,
      day,
      startTime,
      endTime,
      description,
      location,
    };
    if (onSave) {
      onSave(scheduleData);  // Call the onSave function passed from the parent
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="class">Class</option>
        <option value="organization">Organization</option>
      </select>
      <select value={day} onChange={(e) => setDay(e.target.value)}>
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
        <option value="Saturday">Saturday</option>
        <option value="Sunday">Sunday</option>
      </select>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default ScheduleForm;