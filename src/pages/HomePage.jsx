import React, { useState, useEffect } from 'react';
import { format, add, isWithinInterval, parseISO, startOfWeek } from 'date-fns';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { auth } from '../firebase-config';
import { generateTwoWeekPeriods } from '../utils/dateUtils';

const HomePage = () => {
  const [progress, setProgress] = useState(0);
  const periods = generateTwoWeekPeriods();

  useEffect(() => {
    const db = getDatabase();
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    const now = new Date();
    const currentPeriod = periods.find(period => isWithinInterval(now, { start: period.start, end: period.end }));

    if (!currentPeriod) return;

    const periodKey = format(currentPeriod.start, 'yyyy-MM-dd') + "_to_" + format(currentPeriod.end, 'yyyy-MM-dd');
    const periodRef = ref(db, `buttonPresses/${userId}/periods/${periodKey}/entries`);

    onValue(periodRef, (snapshot) => {
      let entriesCount = 0;
      snapshot.forEach(() => {
        entriesCount++;
      });
      setProgress(entriesCount);
    });
  }, []);

  const addPressEntry = () => {
    const db = getDatabase();
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    const now = new Date();
  
    const period = generateTwoWeekPeriods().find(p => isWithinInterval(now, { start: p.start, end: p.end }));
    if (!period) return;
  
    const periodKey = format(period.start, 'yyyy-MM-dd') + "_to_" + format(period.end, 'yyyy-MM-dd');
    const newEntryRef = ref(db, `buttonPresses/${userId}/periods/${periodKey}/entries`);
  
    push(newEntryRef, {
      timestamp: now.toISOString(),
    });
  };

const progressPercentage = Math.min((progress / 5) * 100, 100);

return (
<div className="flex flex-col items-center justify-start pt-8 mt-8 space-y-4">
  <div className="radial-progress bg-primary text-primary-content border-4 border-primary" 
      style={{"--value": progressPercentage, "--max": 100, "--size": "12rem", "--thickness": "1rem"}} 
      role="progressbar"
  >
    {`${progress}`}
  </div>
  <button className="btn btn-primary" onClick={addPressEntry}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
      </svg>
  </button>
</div>
  );
};

export default HomePage;