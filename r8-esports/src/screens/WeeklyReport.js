import React, { useState, useEffect } from 'react';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip } from 'chart.js';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { FaHome, FaDraftingCompass, FaUserFriends, FaUsers, FaChartBar, FaSignOutAlt, FaSave, FaTrash } from 'react-icons/fa';
import PageTitle from '../components/PageTitle';
import Header from '../components/Header';
import useSessionTimeout from '../hooks/useSessionTimeout';

const PROGRESSION_LABELS = {
  5: 'EXCELLENT',
  4: 'GOOD',
  3: 'MEDIOCRE',
  2: 'BAD',
  1: 'VERY POOR PERF.'
};

function getProgressionScore(win, lose) {
  const total = win + lose;
  if (total === 0) return null;
  const winRate = win / total;
  if (winRate >= 0.9) return 5;
  if (winRate >= 0.7) return 4;
  if (winRate >= 0.5) return 3;
  if (winRate >= 0.2) return 2;
  return 1;
}

export default function WeeklyReport() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([
    {
      startDate: addDays(new Date(), -6),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [progressionData, setProgressionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  // User avatar state
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSessionTimeoutModal, setShowSessionTimeoutModal] = useState(false);

  // User session timeout: 30 minutes
  useSessionTimeout(30, 'currentUser', '/', (timeoutMinutes) => {
    setShowSessionTimeoutModal(true);
  });

  // Check if user is logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);



  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuthToken');
    navigate('/');
  };

  // Load notes from database on mount
  useEffect(() => {
    loadNotesFromDatabase();
  }, []);

  // Function to load notes from database
  const loadNotesFromDatabase = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSavedNotes(data.data);
        }
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  // Function to save a new note
  const handleSaveNote = async () => {
    if (!noteTitle.trim() || !notes.trim()) {
      alert('Please enter both a title and notes content.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to save notes.');
        return;
      }

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteTitle.trim(),
          content: notes.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reload notes from database
        await loadNotesFromDatabase();
        setNoteTitle('');
        setNotes('');
        alert('Note saved successfully!');
      } else {
        alert(data.message || 'Failed to save note.');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  // Function to delete a saved note
  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please log in to delete notes.');
        return;
      }

      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reload notes from database
        await loadNotesFromDatabase();
        alert('Note deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete note.');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  // Helper to get current team from localStorage
  function getCurrentTeam(data) {
    try {
      const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
      if (latestTeam && latestTeam.teamName) return latestTeam.teamName;
    } catch {}
    // fallback: first team in data
    for (const match of data) {
      if (match.teams && match.teams.length > 0) return match.teams[0].team;
    }
    return '';
  }

  const startDate = format(dateRange[0].startDate, 'yyyy-MM-dd');
  const endDate = format(dateRange[0].endDate, 'yyyy-MM-dd');

  useEffect(() => {
    if (!startDate || !endDate) return;
    setLoading(true);
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        const currentTeam = getCurrentTeam(data);
        // Filter matches by date range and current team
        const filtered = data.filter(match => {
          const d = new Date(match.match_date);
          // Only include matches where current team participated
          return d >= new Date(startDate) && d <= new Date(endDate) && match.teams.some(t => t.team === currentTeam);
        });
        // Group by day
        const dayMap = {};
        for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().slice(0, 10);
          dayMap[key] = { win: 0, lose: 0 };
        }
        filtered.forEach(match => {
          const key = new Date(match.match_date).toISOString().slice(0, 10);
          if (!(key in dayMap)) return;
          // Find the current team in this match
          const team = match.teams.find(t => t.team === currentTeam);
          if (!team) return;
          if (team.team === match.winner) dayMap[key].win++;
          else dayMap[key].lose++;
        });
        // Build progression array
        const days = Object.keys(dayMap).sort();
        const progression = days.map(day => {
          const { win, lose } = dayMap[day];
          return {
            day,
            score: getProgressionScore(win, lose),
            win,
            lose
          };
        });
        setProgressionData(progression);
        setLoading(false);
      });
  }, [startDate, endDate]);

     return (
     <div className="h-screen flex flex-col overflow-hidden" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
      <PageTitle title="Weekly Report" />
      
      {/* Header Component */}
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowProfile={() => setShowProfileModal(true)}
      />

                                                   {/* Main Content */}
        <div className="flex flex-col h-screen overflow-hidden" style={{ marginTop: 80 }}>
          <div className="w-full flex flex-col items-start pl-8 pr-8 overflow-hidden">
          
          
                                                                                                                                                                                                                                                                        
               <div className="w-full flex flex-row items-stretch gap-4">
                 {/* Chart container */}
                 <div className="bg-[#23232a] rounded-xl shadow-lg p-8 flex-1 flex flex-col items-center">
                {/* Date Range Picker inside chart */}
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
               {loading ? (
                 <div className="text-blue-300 mt-8">Loading...</div>
               ) : (
                 progressionData.length > 0 ? (
                   <div className="w-full">
                     <Line
                       data={{
                         labels: progressionData.map((d, i) => `Day ${i + 1}`),
                         datasets: [
                           {
                             label: 'Progression',
                             data: progressionData.map(d => d.score),
                             borderColor: '#facc15',
                             backgroundColor: '#facc15',
                             tension: 0.3,
                             pointRadius: 5,
                             pointBackgroundColor: '#facc15',
                             fill: false,
                           },
                         ],
                       }}
                       options={{
                         responsive: true,
                         plugins: {
                           legend: { display: false },
                           tooltip: {
                             callbacks: {
                               label: ctx => {
                                 const d = progressionData[ctx.dataIndex];
                                 return ` ${PROGRESSION_LABELS[d.score] || 'No Data'} (Win: ${d.win}, Lose: ${d.lose})`;
                               }
                             }
                           },
                           title: {
                             display: true,
                             text: 'TRAINING PROGRESS TRACKER',
                             font: { size: 22, weight: 'bold' },
                             color: '#fff',
                             padding: { top: 10, bottom: 20 }
                           }
                         },
                         scales: {
                           y: {
                             min: 1,
                             max: 5,
                             ticks: {
                               stepSize: 1,
                               callback: v => `${v} ${PROGRESSION_LABELS[v] ? PROGRESSION_LABELS[v] : ''}`,
                               color: '#fff',
                               font: { weight: 'bold' }
                             },
                             title: {
                               display: true,
                               text: 'PROGRESSION',
                               color: '#fff',
                               font: { weight: 'bold' }
                             },
                             grid: { color: '#444' }
                           },
                           x: {
                             title: {
                               display: true,
                               text: 'NUMBER OF DAYS',
                               color: '#fff',
                               font: { weight: 'bold' }
                             },
                             ticks: { color: '#fff', font: { weight: 'bold' } },
                             grid: { color: '#444' }
                           }
                         }
                       }}
                                               height={350}
                        width={900}
                     />
                   </div>
                 ) : (
                   <div className="text-gray-300 mt-8">No data for selected range.</div>
                 )
               )}
             </div>
                                                                                                               {/* Notes field */}
                <div className="flex flex-col flex-1">
                  <div className="bg-[#23232a] rounded-xl shadow-lg p-4 border border-gray-700 h-full">
                 <label className="text-gray-200 font-semibold mb-2 block">Notes Title</label>
                 <input
                   type="text"
                   className="bg-[#1a1a1f] text-white rounded-lg px-3 py-2 w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
                   placeholder="Enter note title..."
                   value={noteTitle}
                   onChange={e => setNoteTitle(e.target.value)}
                 />
                 <label className="text-gray-200 font-semibold mb-2 block">Notes Content</label>
                                   <textarea
                    className="bg-[#1a1a1f] text-white rounded-lg p-3 resize-none border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full mb-3"
                    style={{ height: 300, minHeight: 300 }}
                    placeholder="Enter your notes here..."
                    value={notes || ""}
                    onChange={e => setNotes(e.target.value)}
                  />
                 <button
                   onClick={handleSaveNote}
                   className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                 >
                   <FaSave className="w-4 h-4" />
                   Save Note
                 </button>
               </div>
             </div>
           </div>
           
                       {/* Saved Notes Display - Below Chart */}
            <div className="w-[900px] max-w-5xl mt-6">
              <div className="bg-[#23232a] rounded-xl shadow-lg p-6 border border-gray-700">
               <h3 className="text-gray-200 font-semibold mb-4 text-lg">Saved Notes</h3>
               {savedNotes.length === 0 ? (
                 <p className="text-gray-400 text-sm">No saved notes yet.</p>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {savedNotes.map((note) => (
                     <div key={note.id} className="bg-[#1a1a1f] rounded-lg p-4 border border-gray-600">
                       <div className="flex justify-between items-start mb-3">
                         <h4 className="text-white font-semibold text-sm">{note.title}</h4>
                         <button
                           onClick={() => handleDeleteNote(note.id)}
                           className="text-red-400 hover:text-red-300 transition-colors"
                           title="Delete note"
                         >
                           <FaTrash className="w-3 h-3" />
                         </button>
                       </div>
                       <p className="text-gray-300 text-xs mb-3">{note.date_formatted}</p>
                       <p className="text-gray-200 text-sm whitespace-pre-wrap">{note.content}</p>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </div>
        </div>
      </div>

             {/* Profile Modal */}
       <ProfileModal
         isOpen={showProfileModal}
         onClose={() => setShowProfileModal(false)}
         user={currentUser}
       />

       {/* Session Timeout Modal */}
       <SessionTimeoutModal
         isOpen={showSessionTimeoutModal}
         onClose={() => setShowSessionTimeoutModal(false)}
         timeoutMinutes={30}
       />
     </div>
   );
 }

 // Session Timeout Modal Component
 function SessionTimeoutModal({ isOpen, onClose, timeoutMinutes }) {
   if (!isOpen) return null;

   return (
     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
       <div className="bg-gray-900 rounded-xl shadow-2xl p-0 w-full max-w-md mx-4 border border-gray-700">
         {/* Header */}
         <div className="bg-red-800 px-6 py-4 rounded-t-xl flex justify-between items-center border-b border-gray-700">
           <h2 className="text-xl font-bold text-white">Session Expired</h2>
           <button
             onClick={onClose}
             className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
           >
             ×
           </button>
         </div>

         {/* Content */}
         <div className="p-6 bg-gray-900 rounded-b-xl">
           <div className="flex items-center mb-4">
             <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mr-4">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div>
               <h3 className="text-lg font-semibold text-white">Session Timeout</h3>
               <p className="text-gray-400 text-sm">Your session has expired due to inactivity</p>
             </div>
           </div>
           
           <p className="text-gray-300 mb-6">
             Your session expired due to {timeoutMinutes} minutes of inactivity. 
             Please log in again to continue using the application.
           </p>

           <div className="flex justify-end">
             <button
               onClick={onClose}
               className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-lg transition-colors"
             >
               OK
             </button>
           </div>
         </div>
       </div>
     </div>
   );
 }

// Profile Modal Component
function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-0 w-full max-w-2xl mx-4 border border-gray-700">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 rounded-t-xl flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-900 rounded-b-xl">
          {/* User Profile Section */}
          <div className="flex items-start mb-6">
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-12 h-12" fill="white" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">
                {user?.name || 'User Name'}
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                @{user?.email?.split('@')[0] || 'username'}
              </p>
              
              {/* Status Tags */}
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-300 border border-emerald-500/40">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                  Active
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-300 border border-indigo-500/40">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  User
                </span>
              </div>
            </div>
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-300">@{user?.email?.split('@')[0] || 'username'}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300">Not provided</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-amber-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-gray-300">••••••••</span>
                  <button className="ml-2 text-gray-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Account Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">Last Login: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">Date Added: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">Last Updated: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
