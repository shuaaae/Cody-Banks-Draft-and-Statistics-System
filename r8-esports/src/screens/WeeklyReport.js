import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import { addDays, format } from 'date-fns';
import PageTitle from '../components/PageTitle';
import Header from '../components/Header';
import useSessionTimeout from '../hooks/useSessionTimeout';
import {
  DateRangePicker,
  ProgressionChart,
  NotesEditor,
  SavedNotesList,
  SessionTimeoutModal,
  FullNoteModal,
  SuccessModal,
  ProfileModal
} from '../components/WeeklyReport';
=======
import mobaImg from '../assets/moba1.png';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip } from 'chart.js';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { FaHome, FaDraftingCompass, FaUserFriends, FaUsers, FaChartBar } from 'react-icons/fa';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

const PROGRESSION_LABELS = {
  5: 'EXCELLENT',
  4: 'GOOD',
  3: 'MEDIOCRE',
  2: 'BAD',
  1: 'VERY POOR PERF.'
};
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5

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

<<<<<<< HEAD
// Helper function to get default date range
function getDefaultDateRange() {
  return [
=======
export default function WeeklyReport() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
    {
      startDate: addDays(new Date(), -6),
      endDate: new Date(),
      key: 'selection',
    },
<<<<<<< HEAD
  ];
}

// Helper function to load date range from localStorage
function loadDateRangeFromStorage() {
  try {
    const savedDateRange = localStorage.getItem('weeklyReportDateRange');
    if (savedDateRange) {
      const parsed = JSON.parse(savedDateRange);
      // Convert string dates back to Date objects
      return parsed.map(range => ({
        ...range,
        startDate: new Date(range.startDate),
        endDate: new Date(range.endDate)
      }));
    }
  } catch (error) {
    console.error('Error loading date range from localStorage:', error);
  }
  return getDefaultDateRange();
}

// Helper function to save date range to localStorage
function saveDateRangeToStorage(dateRange) {
  try {
    localStorage.setItem('weeklyReportDateRange', JSON.stringify(dateRange));
  } catch (error) {
    console.error('Error saving date range to localStorage:', error);
  }
}

export default function WeeklyReport() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState(loadDateRangeFromStorage);
=======
  ]);
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
  const [showPicker, setShowPicker] = useState(false);
  const [progressionData, setProgressionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
<<<<<<< HEAD
  const [noteTitle, setNoteTitle] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSessionTimeoutModal, setShowSessionTimeoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFullNoteModal, setShowFullNoteModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

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

  // Save date range to localStorage whenever it changes
  useEffect(() => {
    saveDateRangeToStorage(dateRange);
  }, [dateRange]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
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
      const response = await fetch('/api/notes', {
        headers: {
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
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteTitle.trim(),
          content: notes.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await loadNotesFromDatabase();
        setNoteTitle('');
        setNotes('');
        
        setSuccessMessage('Note saved successfully!');
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
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
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await loadNotesFromDatabase();
        
        setSuccessMessage('Note deleted successfully!');
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);
      } else {
        alert(data.message || 'Failed to delete note.');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  // Function to view full note
  const handleViewFullNote = (note) => {
    setSelectedNote(note);
    setShowFullNoteModal(true);
  };

  // Function to format date in MM/DD/YY format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  };

  // Function to sort notes by date
  const getSortedNotes = () => {
    return [...savedNotes].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };
=======

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('weeklyReportNotes');
    if (savedNotes && savedNotes !== 'null') setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weeklyReportNotes', notes);
  }, [notes]);
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5

  // Helper to get current team from localStorage
  function getCurrentTeam(data) {
    try {
      const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
<<<<<<< HEAD
      if (latestTeam && latestTeam.teamName) {
        console.log('Found team in localStorage:', latestTeam.teamName);
        return latestTeam.teamName;
      }
    } catch (error) {
      console.log('Error parsing latestTeam from localStorage:', error);
    }
    
    for (const match of data) {
      if (match.teams && match.teams.length > 0) {
        console.log('Using fallback team:', match.teams[0].team);
        return match.teams[0].team;
      }
    }
    
    console.log('No team found, will show all matches');
=======
      if (latestTeam && latestTeam.teamName) return latestTeam.teamName;
    } catch {}
    // fallback: first team in data
    for (const match of data) {
      if (match.teams && match.teams.length > 0) return match.teams[0].team;
    }
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
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
<<<<<<< HEAD
        console.log('All matches data:', data);
        
        const currentTeam = getCurrentTeam(data);
        console.log('Current team:', currentTeam);
        
        const dateFiltered = data.filter(match => {
          const d = new Date(match.match_date);
          return d >= new Date(startDate) && d <= new Date(endDate);
        });
        
        console.log('Date filtered matches:', dateFiltered);
        
        let filtered;
        if (currentTeam && currentTeam.trim() !== '') {
          filtered = dateFiltered.filter(match => 
            match.teams && match.teams.some(t => t.team === currentTeam)
          );
        } else {
          filtered = dateFiltered;
        }
        
        console.log('Final filtered matches:', filtered);
        
=======
        const currentTeam = getCurrentTeam(data);
        // Filter matches by date range and current team
        const filtered = data.filter(match => {
          const d = new Date(match.match_date);
          // Only include matches where current team participated
          return d >= new Date(startDate) && d <= new Date(endDate) && match.teams.some(t => t.team === currentTeam);
        });
        // Group by day
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
        const dayMap = {};
        for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().slice(0, 10);
          dayMap[key] = { win: 0, lose: 0 };
        }
<<<<<<< HEAD
        
        filtered.forEach(match => {
          const key = new Date(match.match_date).toISOString().slice(0, 10);
          if (!(key in dayMap)) return;
          
          if (currentTeam && currentTeam.trim() !== '') {
            const team = match.teams.find(t => t.team === currentTeam);
            if (!team) return;
            if (team.team === match.winner) dayMap[key].win++;
            else dayMap[key].lose++;
          } else {
            dayMap[key].win++;
          }
        });
        
        console.log('Day map:', dayMap);
        
=======
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
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
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
<<<<<<< HEAD
        
        console.log('Progression data:', progression);
        setProgressionData(progression);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching matches:', error);
        setLoading(false);
      });
  }, [startDate, endDate]);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
      <PageTitle title="Weekly Report" />
      
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowProfile={() => setShowProfileModal(true)}
      />

      <div className="flex flex-col h-screen overflow-hidden" style={{ marginTop: 80 }}>
        <div className="w-full flex flex-col items-start pl-8 pr-8 overflow-hidden">
          <div className="w-full flex flex-row items-stretch gap-4">
            {/* Chart container */}
            <div className="bg-[#23232a] rounded-xl shadow-lg p-8 flex-1 flex flex-col items-center">
              <DateRangePicker 
                dateRange={dateRange}
                setDateRange={setDateRange}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
              />
              <ProgressionChart 
                progressionData={progressionData}
                loading={loading}
              />
            </div>
            
            {/* Notes field */}
            <NotesEditor 
              noteTitle={noteTitle}
              setNoteTitle={setNoteTitle}
              notes={notes}
              setNotes={setNotes}
              onSaveNote={handleSaveNote}
            />
          </div>
          
          {/* Saved Notes Display */}
          <SavedNotesList 
            savedNotes={savedNotes}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onDeleteNote={handleDeleteNote}
            onViewFullNote={handleViewFullNote}
            formatDate={formatDate}
            getSortedNotes={getSortedNotes}
          />
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
      />

      <SessionTimeoutModal
        isOpen={showSessionTimeoutModal}
        onClose={() => setShowSessionTimeoutModal(false)}
        timeoutMinutes={30}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
      />

      <FullNoteModal
        isOpen={showFullNoteModal}
        onClose={() => setShowFullNoteModal(false)}
        note={selectedNote}
      />
=======
        setProgressionData(progression);
        setLoading(false);
      });
  }, [startDate, endDate]);

  // Navbar links config
  const navLinks = [
    { label: 'DATA DRAFT', path: '/home' },
    { label: 'MOCK DRAFT', path: '/mock-draft' },
    { label: 'PLAYERS STATISTIC', path: '/players-statistic' },
    { label: 'TEAM HISTORY', path: '/team-history' },
    { label: 'WEEKLY REPORT', path: '/weekly-report' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
      {/* Top Navbar */}
      <header
        className="w-full fixed top-0 left-0 z-50 flex items-center justify-between px-12"
        style={{
          height: 80,
          background: 'transparent',
          boxShadow: 'none',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 select-none cursor-pointer" onClick={() => navigate('/home')}>
          <img
            src={mobaImg}
            alt="Logo"
            className="h-32 w-32 object-contain"
            style={{ borderRadius: 28, background: 'transparent', boxShadow: 'none' }}
          />
        </div>
        {/* Nav Links */}
        <nav className="flex justify-end w-full">
          <ul className="flex gap-10 mr-0">
            {navLinks.map(link => (
              <li key={link.label}>
                <button
                  className={`uppercase font-extrabold tracking-widest text-base transition-all px-2 py-1 ` +
                    (window.location.pathname === link.path
                      ? 'text-[#FFD600] border-b-2 border-[#FFD600]'
                      : 'text-white hover:text-[#FFD600] hover:border-b-2 hover:border-[#FFD600]')}
                  style={{ background: 'none', border: 'none', outline: 'none' }}
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* Right side empty for now */}
        <div style={{ width: 48 }} />
      </header>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen flex-1" style={{ marginTop: 80 }}>
        <div className="w-full mt-4 flex flex-col items-start pl-8 pr-8">
          {/* Date Range Picker TOP LEFT aligned */}
          <div className="flex flex-col items-start gap-4 mb-6 w-[320px]">
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
          {/* Remove Team Selector Dropdown */}
          {/* Chart and Notes side by side */}
          <div className="w-full flex flex-row items-start">
            {/* Chart container */}
            <div className="bg-[#23232a] rounded-xl shadow-lg p-8 w-[900px] max-w-5xl flex flex-col items-center">
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
            <div className="flex flex-col flex-1 ml-8 h-[350px] -mt-8">
              <label className="text-gray-200 font-semibold mb-2">Notes</label>
              <textarea
                className="bg-[#23232a] text-white rounded-xl shadow-lg p-4 resize-none border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                style={{ height: 350, minHeight: 350, maxHeight: 350 }}
                placeholder="Enter your notes here..."
                value={notes || ""}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
    </div>
  );
}
