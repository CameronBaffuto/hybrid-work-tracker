import React, { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { getDatabase, ref, onValue, push, remove } from 'firebase/database';
import { auth } from '../firebase-config';
import { generateTwoWeekPeriods } from '../utils/dateUtils';

const HistoryPage = () => {
  const [periodsData, setPeriodsData] = useState({});
  const [dateToAdd, setDateToAdd] = useState('');
  const [timeToAdd, setTimeToAdd] = useState('');

  const openModal = () => {
    document.getElementById('addEntryModal').showModal();
  };

  useEffect(() => {
    const db = getDatabase();
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    const periodsRef = ref(db, `buttonPresses/${userId}/periods`);
  
    onValue(periodsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const allPeriods = generateTwoWeekPeriods();
      let formattedData = allPeriods.reduce((acc, period) => {
        const periodKey = format(period.start, 'yyyy-MM-dd') + "_to_" + format(period.end, 'yyyy-MM-dd');
        let entries = [];
        if (data[periodKey] && data[periodKey].entries) {
          entries = Object.entries(data[periodKey].entries)
            .map(([key, entry]) => ({
              key,
              timestamp: entry.timestamp,
              formattedTimestamp: format(parseISO(entry.timestamp), 'EEE MMM dd HH:mm:ss'),
            }))
            .sort((a, b) => parseISO(b.timestamp) - parseISO(a.timestamp)); // Sort entries within a period
        }
        acc[periodKey] = entries;
        return acc;
      }, {});
  
      // Sort the periods by the start date in descending order
      formattedData = Object.entries(formattedData)
        .sort((a, b) => {
          const startDateA = parseISO(a[0].split('_to_')[0]);
          const startDateB = parseISO(b[0].split('_to_')[0]);
          return startDateB - startDateA;
        })
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
      setPeriodsData(formattedData);
    });
  }, []);
  

  const addEntryManually = () => {
    const db = getDatabase();
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    const dateTime = parseISO(`${dateToAdd}T${timeToAdd}`);
    const period = generateTwoWeekPeriods().find(p => isWithinInterval(dateTime, { start: p.start, end: p.end }));
    if (!period) return;

    const periodKey = format(period.start, 'yyyy-MM-dd') + "_to_" + format(period.end, 'yyyy-MM-dd');
    const newEntryRef = ref(db, `buttonPresses/${userId}/periods/${periodKey}/entries`);

    push(newEntryRef, {
      timestamp: dateTime.toISOString(),
    });
    document.getElementById('addEntryModal').close();
    setDateToAdd('');
    setTimeToAdd('');
  };

  const deleteEntry = (periodKey, entryKey) => {
    const db = getDatabase();
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    const entryRef = ref(db, `buttonPresses/${userId}/periods/${periodKey}/entries/${entryKey}`);

    remove(entryRef)
      .then(() => {
        console.log('Entry deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting entry:', error);
      });
  };

  const formatPeriod = (period) => {
    const [startDateStr, endDateStr] = period.split('_to_');
    const startDate = parseISO(startDateStr);
    const endDate = parseISO(endDateStr);
    return `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`;
  };

  return (
    <div className="px-4 md:px-8">
      <div className="flex justify-end my-4">
        <button className="btn btn-accent" onClick={openModal}>Add New Entry</button>
      </div>
      <dialog id="addEntryModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Entry</h3>
          <div className="my-4">
            <input type="date" value={dateToAdd} onChange={(e) => setDateToAdd(e.target.value)} className="input input-bordered w-full max-w-xs" />
            <input type="time" value={timeToAdd} onChange={(e) => setTimeToAdd(e.target.value)} className="input input-bordered w-full max-w-xs" />
          </div>
          <div className="modal-action">
            <button className="btn btn-success" onClick={addEntryManually}>Add</button>
            <button className="btn btn-warning" onClick={() => document.getElementById('addEntryModal').close()}>Close</button>
          </div>
        </div>
      </dialog>
      <div className="overflow-x-auto">
        <table className="table w-full">
          {Object.entries(periodsData).map(([period, entries]) => {
            if (entries.length > 0) {
              return (
                <React.Fragment key={period}>
                  <thead>
                    <tr><th className="text-lg font-bold p-4" colSpan="2">{formatPeriod(period)}</th></tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.key}>
                        <td className="text-center">{entry.formattedTimestamp}</td>
                        <td>
                          <button className="btn btn-xs btn-error" onClick={() => deleteEntry(period, entry.key)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </React.Fragment>
              );
            }
            return null; // Skip rendering if there are no entries
          })}
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;