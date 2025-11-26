// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Get day name
export const getDayName = (date = new Date()) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

// Calculate duration in hours
export const calculateDuration = (startTime, endTime) => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  const durationMinutes = endMinutes - startMinutes;
  return (durationMinutes / 60).toFixed(1);
};

// Get today's schedules
export const getTodaySchedules = (schedules) => {
  const today = getDayName();
  return schedules.filter(schedule => schedule.day === today);
};

// Calculate weekly hours
export const calculateWeeklyHours = (schedules) => {
  let totalHours = 0;
  let classHours = 0;
  let orgHours = 0;
  
  schedules.forEach(schedule => {
    const duration = parseFloat(calculateDuration(schedule.startTime, schedule.endTime));
    totalHours += duration;
    
    if (schedule.type === 'class') {
      classHours += duration;
    } else {
      orgHours += duration;
    }
  });
  
  return {
    total: totalHours.toFixed(1),
    class: classHours.toFixed(1),
    organization: orgHours.toFixed(1),
  };
};

// Calculate rest days
export const calculateRestDays = (schedules) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const busyDays = new Set(schedules.map(s => s.day));
  return days.filter(day => !busyDays.has(day));
};

// Burnout calculation
export const calculateBurnoutLevel = (schedules, moods = []) => {
  const weeklyHours = calculateWeeklyHours(schedules);
  const restDays = calculateRestDays(schedules);
  const totalHours = parseFloat(weeklyHours.total);
  const orgHours = parseFloat(weeklyHours.organization);
  const classHours = parseFloat(weeklyHours.class);
  
  let level = 'low';
  let score = 0;
  const warnings = [];
  
  if (totalHours > 15) {
    score += 30;
    warnings.push('High workload: More than 15 hours per week');
  }
  
  if (restDays.length === 0) {
    score += 35;
    warnings.push('No rest days: You need a break!');
  }
  
  if (orgHours > classHours) {
    score += 25;
    warnings.push('Organization hours exceed academic hours');
  }
  
  if (score >= 60) {
    level = 'high';
  } else if (score >= 30) {
    level = 'medium';
  }
  
  return {
    level,
    score,
    warnings,
    restDays: restDays.length,
    totalHours,
    orgHours,
    classHours,
  };
};

// Sort schedules by time
export const sortSchedulesByTime = (schedules) => {
  return [...schedules].sort((a, b) => {
    if (a.startTime < b.startTime) return -1;
    if (a.startTime > b.startTime) return 1;
    return 0;
  });
};