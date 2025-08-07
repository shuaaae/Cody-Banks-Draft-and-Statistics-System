import React, { useState, useEffect } from 'react';
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

// Helper function to get default date range
function getDefaultDateRange() {
  return [
    {
      startDate: addDays(new Date(), -6),
      endDate: new Date(),
      key: 'selection',
    },
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
  const [showPicker, setShowPicker] = useState(false);
  const [progressionData, setProgressionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
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

  // Helper to get current team from localStorage
  function getCurrentTeam(data) {
    try {
      const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
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
        
        const dayMap = {};
        for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().slice(0, 10);
          dayMap[key] = { win: 0, lose: 0 };
        }
        
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
                dateRange={dateRange}
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
    </div>
  );
}
