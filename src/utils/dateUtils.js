import { startOfYear, add, endOfWeek } from 'date-fns';

export const generateTwoWeekPeriods = () => {
  const yearStart = startOfYear(new Date());
  let currentStart = yearStart;
  const periods = [];

  while (currentStart.getFullYear() === yearStart.getFullYear()) {
    // First, find the end of the week (Sunday) for the current period start
    const firstWeekEnd = endOfWeek(currentStart, { weekStartsOn: 1 });
    // Then, calculate the end of the two-week period to be the Friday of the next week
    // This is done by adding one more week to the firstWeekEnd and then adjusting to Friday
    const periodEnd = add(firstWeekEnd, { days: 5 }); // 5 days from Sunday to Friday

    periods.push({
      start: currentStart,
      end: periodEnd
    });
    // Set the next period start to the day after the current period ends
    currentStart = add(periodEnd, { days: 3 }); // Skip the weekend
  }

  return periods;
};
