import React, { useState, useEffect } from 'react';
import mobaImg from '../assets/moba1.jpg';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip } from 'chart.js';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

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

  return (
    <div className="min-h-screen bg-[#181A20]">
      <header className="flex items-center pl-0 pr-8 py-0" style={{ background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${navbarBg}) center/cover, #23232a`, borderBottom: '1px solid #23283a', height: '80px' }}>
        <img
          src={mobaImg}
          alt="MOBA"
          className="h-20 w-44 object-cover cursor-pointer"
          style={{
            margin: 0,
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to top, transparent 0%, black 20%, black 100%)',
            WebkitMaskComposite: 'destination-in',
            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to top, transparent 0%, black 20%, black 100%)',
            boxShadow: '4px 0 16px 0 rgba(0,0,0,0.4)'
          }}
          onClick={() => navigate('/')} />
        <div className="flex-1 flex items-center">
          <nav className="flex space-x-8 ml-4">
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/home')}>Data Draft</button>
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/mock-draft')}>Mock Draft</button>
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/players-statistic')}>Players Statistic</button>
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/team-history')}>Team History</button>
            <button className="text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold">Weekly Report</button>
          </nav>
        </div>
      </header>
      <div className="flex flex-col min-h-screen" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
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
