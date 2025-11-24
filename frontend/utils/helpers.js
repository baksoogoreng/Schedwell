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
  
  // Get week schedules grouped by day
  export const getWeekSchedules = (schedules) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = {};
    
    days.forEach(day => {
      grouped[day] = schedules.filter(schedule => schedule.day === day);
    });
    
    return grouped;
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
  
  // Burnout calculation (rule-based)
  export const calculateBurnoutLevel = (schedules, moods = []) => {
    const weeklyHours = calculateWeeklyHours(schedules);
    const restDays = calculateRestDays(schedules);
    const totalHours = parseFloat(weeklyHours.total);
    const orgHours = parseFloat(weeklyHours.organization);
    const classHours = parseFloat(weeklyHours.class);
    
    // Calculate meetings per day
    const dailySchedules = {};
    schedules.forEach(schedule => {
      dailySchedules[schedule.day] = (dailySchedules[schedule.day] || 0) + 1;
    });
    const maxMeetingsPerDay = Math.max(...Object.values(dailySchedules), 0);
    
    // Check stress levels from moods
    const recentStress = moods.slice(0, 3).map(m => m.stressLevel);
    const avgStress = recentStress.length > 0 
      ? recentStress.reduce((a, b) => a + b, 0) / recentStress.length 
      : 0;
    
    let level = 'low';
    let score = 0;
    const warnings = [];
    
    // Rule 1: Total hours > 15
    if (totalHours > 15) {
      score += 30;
      warnings.push('High workload: More than 15 hours per week');
    }
    
    // Rule 2: No rest days
    if (restDays.length === 0) {
      score += 35;
      warnings.push('No rest days: You need a break!');
    } else if (restDays.length === 1) {
      score += 15;
      warnings.push('Only 1 rest day: Consider adding more breaks');
    }
    
    // Rule 3: Org hours > Class hours
    if (orgHours > classHours) {
      score += 25;
      warnings.push('Organization hours exceed academic hours');
    }
    
    // Rule 4: Too many meetings per day
    if (maxMeetingsPerDay > 3) {
      score += 20;
      warnings.push(`Too many commitments: ${maxMeetingsPerDay} per day`);
    }
    
    // Rule 5: High stress levels
    if (avgStress >= 4) {
      score += 25;
      warnings.push('High stress levels detected for past 3 days');
    } else if (avgStress >= 3) {
      score += 10;
      warnings.push('Moderate stress levels detected');
    }
    
    // Determine level
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
  
  // Mood emoji mapper
  export const getMoodEmoji = (mood) => {
    const emojis = {
      1: '😢',
      2: '😕',
      3: '😐',
      4: '😊',
      5: '😄',
    };
    return emojis[mood] || '😐';
  };
  
  // Stress level text
  export const getStressText = (level) => {
    const texts = {
      1: 'Very Low',
      2: 'Low',
      3: 'Moderate',
      4: 'High',
      5: 'Very High',
    };
    return texts[level] || 'Unknown';
  };
  
  // Sort schedules by time
  export const sortSchedulesByTime = (schedules) => {
    return [...schedules].sort((a, b) => {
      if (a.startTime < b.startTime) return -1;
      if (a.startTime > b.startTime) return 1;
      return 0;
    });
  };