import React, { useState } from 'react';
import './MoodWellness.css';

const MoodWellness = () => {
  // State untuk mood, stress level, tanggal, dan status submit
  const [mood, setMood] = useState('');
  const [stressLevel, setStressLevel] = useState(3); // Default level 3
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Format tanggal YYYY-MM-DD
  const [submitted, setSubmitted] = useState(false); // New state for submit status

  // Fungsi untuk menangani perubahan mood
  const handleMoodChange = (event) => {
    setMood(event.target.value);
  };

  // Fungsi untuk menangani perubahan tingkat stres
  const handleStressChange = (event) => {
    setStressLevel(event.target.value);
  };

  // Fungsi untuk menangani perubahan tanggal
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  // Fungsi untuk mengirimkan data (bisa disesuaikan untuk menyimpan di server atau lokal)
  const handleSubmit = () => {
    const wellnessData = {
      mood,
      stressLevel,
      date,
    };
    console.log('Mood Wellness Data Submitted:', wellnessData);
    setSubmitted(true); // Set submitted state to true to trigger feedback
    setTimeout(() => {
      setSubmitted(false); // Reset after 3 seconds
    }, 3000); // Feedback time
  };

  return (
    <div className="mood-wellness-container">
      <h2>Daily Mood & Wellness Check-In</h2>

      <div className="mood-input">
        <label htmlFor="mood">Mood:</label>
        <select id="mood" value={mood} onChange={handleMoodChange}>
          <option value="">Select Mood</option>
          <option value="😊">😊 HAAAAPPYYY</option>
          <option value="😐">😐 E-eum..just neutral?</option>
          <option value="😞">😞 I'M Feeling BLUE huhu</option>
</select>
      </div>

      <div className="stress-level">
        <label htmlFor="stressLevel">Stress Level (1-5):</label>
        <input
          type="range"
          id="stressLevel"
          min="1"
          max="5"
          value={stressLevel}
          onChange={handleStressChange}
        />
        <span>{stressLevel}</span>
      </div>

      <div className="date-picker">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={handleDateChange}
        />
      </div>

      <div className="submit-button">
        <button 
          onClick={handleSubmit}
          disabled={submitted}  // Disable button after submit
          className={submitted ? 'submitted' : ''} // Apply class when submitted
        >
          {submitted ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default MoodWellness;