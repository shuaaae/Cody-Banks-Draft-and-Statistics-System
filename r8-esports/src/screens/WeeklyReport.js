import React, { useState, useEffect } from 'react';
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
import { FaHome, FaDraftingCompass, FaUserFriends, FaUsers, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import PageTitle from '../components/PageTitle';
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
  // User avatar state
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // User session timeout: 30 minutes
  useSessionTimeout(30, 'currentUser', '/');

  // Check if user is logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuthToken');
    navigate('/');
  };

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('weeklyReportNotes');
    if (savedNotes && savedNotes !== 'null') setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weeklyReportNotes', notes);
  }, [notes]);

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

  // Navbar links config
  const navLinks = [
    { label: 'DATA DRAFT', path: '/home' },
    { label: 'MOCK DRAFT', path: '/mock-draft' },
    { label: 'PLAYERS STATISTIC', path: '/players-statistic' },
    { label: 'WEEKLY REPORT', path: '/weekly-report' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
      <PageTitle title="Weekly Report" />
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
          <ul className="flex gap-10 mr-8">
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
        {/* User Avatar and Dropdown */}
        <div className="relative user-dropdown">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-105 shadow-lg"
          >
            {/* Square Avatar with Black and White Icon */}
            <svg className="w-6 h-6" fill="white" stroke="black" strokeWidth="1" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showUserDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-0">
                    <svg className="w-6 h-6" fill="white" stroke="black" strokeWidth="1" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {currentUser?.name || 'User'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {currentUser?.email || 'user@example.com'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    // Add profile or settings functionality here
                  }}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    // Add settings functionality here
                  }}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31-2.37-2.37a1.724 1.724 0 00-2.572-1.065c-.426 1.756-2.924 1.756-3.35 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </div>
                </button>

                {/* Divider */}
                <div className="border-t border-gray-600 my-1"></div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors text-sm"
                >
                  <div className="flex items-center gap-2">
                    <FaSignOutAlt className="w-4 h-4" />
                    Logout
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
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
    </div>
  );
}
