import React from 'react';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangePicker({ 
  dateRange, 
  setDateRange, 
  showPicker, 
  setShowPicker 
}) {
  return (
    <div className="flex flex-col items-start gap-4 mb-6 w-full">
      <label className="text-gray-200 font-semibold mb-1">Select Date Range</label>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded shadow"
        onClick={() => setShowPicker(v => !v)}
      >
        {format(dateRange[0].startDate, 'MMM d, yyyy')} - {format(dateRange[0].endDate, 'MMM d, yyyy')}
      </button>
      {/* Modal Date Picker */}    
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-4" style={{ minWidth: 340 }} onClick={e => e.stopPropagation()}>
            <DateRange
              locale={enUS}
              editableDateInputs={true}
              onChange={item => {
                setDateRange([item.selection]);
                setShowPicker(false);
              }}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              maxDate={new Date()}
            />
          </div>
        </div>
      )}
    </div>
  );
} 