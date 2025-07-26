import React, { useEffect, useState } from 'react';
import mobaImg from '../assets/moba1.png';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaDraftingCompass, FaUserFriends, FaUsers, FaChartBar, FaTrash } from 'react-icons/fa';

// Add lane options
const LANE_OPTIONS = [
  { key: 'exp', label: 'Exp Lane' },
  { key: 'jungler', label: 'Jungler' },
  { key: 'mid', label: 'Mid Lane' },
  { key: 'gold', label: 'Gold Lane' },
  { key: 'roam', label: 'Roam' },
];

// Lane to hero type mapping for picks
const LANE_TYPE_MAP = {
  exp: 'Fighter',
  jungler: 'Assassin',
  mid: 'Mage',
  gold: 'Marksman',
  roam: 'Support', // or 'Tank' if you want both, but for now Support
};

function HeroImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      className="hero-face-crop"
      loading="lazy"
      style={{
        background: '#181A20', // subtle dark background
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onLoad={() => setLoaded(true)}
    />
  );
}

function ModalBanHeroIcon({ src, alt }) {
  return (
    <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', background: '#181A20', border: '2px solid #f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002', transition: 'transform 0.15s', pointerEvents: 'auto' }} className="hover:scale-110 hover:shadow-lg">
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none' }} />
    </div>
  );
}

export default function HomePage() {
  const [matches, setMatches] = useState([]);
  const [hoveredMatchId, setHoveredMatchId] = useState(null);
  const [banning, setBanning] = useState({
    blue1: [], blue2: [], red1: [], red2: []
  });
  const [heroPickerTarget, setHeroPickerTarget] = useState(null);
  const [modalState, setModalState] = useState('none'); // 'none' | 'export' | 'heroPicker' | 'deleteConfirm'
  const [picks, setPicks] = useState({ blue: { 1: [], 2: [] }, red: { 1: [], 2: [] } }); // { blue: {1: [{lane, hero}], 2: [...]}, red: {...} }
  const [pickTarget, setPickTarget] = useState(null); // { team: 'blue'|'red', pickNum: 1|2, lane: null|string }
  const [showLaneModal, setShowLaneModal] = useState(false);
  const [heroPickerMode, setHeroPickerMode] = useState(null); // 'ban' | 'pick' | null
  const [heroList, setHeroList] = useState([]);
  // New state for looped pick flow
  const [pickFlowState, setPickFlowState] = useState('none'); // 'none' | 'lane-selection' | 'hero-selection'
  const [currentPickSession, setCurrentPickSession] = useState(null); // { team, pickNum, remainingPicks }
  const [pickerStep, setPickerStep] = useState('lane'); // 'lane' or 'hero' - tracks current step in pick flow
  // New state for extra fields
  const [turtleTakenBlue, setTurtleTakenBlue] = useState('');
  const [turtleTakenRed, setTurtleTakenRed] = useState('');
  const [lordTakenBlue, setLordTakenBlue] = useState('');
  const [lordTakenRed, setLordTakenRed] = useState('');
  const [notes, setNotes] = useState('');
  const [playstyle, setPlaystyle] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [allTeams, setAllTeams] = useState([]);
  const [deleteConfirmMatch, setDeleteConfirmMatch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        // Collect all unique team names
        const teamsSet = new Set();
        data.forEach(match => {
          if (match.teams) {
            match.teams.forEach(team => {
              if (team.team) teamsSet.add(team.team);
            });
          }
        });
        setAllTeams(['All Teams', ...Array.from(teamsSet)]);
        // Filter matches for the selected team
        let filtered = data;
        if (selectedTeam && selectedTeam !== 'All Teams') {
          const teamName = selectedTeam.trim().toLowerCase();
          filtered = data.filter(match =>
            match.teams && match.teams.some(team => (team.team || '').trim().toLowerCase() === teamName)
          );
        }
        // Sort latest to oldest by match_date and id
        filtered.sort((a, b) => {
          if (a.match_date === b.match_date) return b.id - a.id;
          return new Date(b.match_date) - new Date(a.match_date);
        });
        setMatches(filtered);
      })
      .catch(err => {
        setMatches([]);
        console.error(err);
      });
  }, [selectedTeam]);

  useEffect(() => {
    fetch('/api/heroes')
      .then(res => res.json())
      .then(data => setHeroList(data));
  }, []);

  // Function to reset all form data
  function resetFormData() {
    // Reset all state variables
    setBanning({
      blue1: [], blue2: [], red1: [], red2: []
    });
    setPicks({ blue: { 1: [], 2: [] }, red: { 1: [], 2: [] } });
    setTurtleTakenBlue('');
    setTurtleTakenRed('');
    setLordTakenBlue('');
    setLordTakenRed('');
    setNotes('');
    setPlaystyle('');
    
    // Reset pick flow state
    setPickFlowState('none');
    setCurrentPickSession(null);
    setHeroPickerMode(null);
    setPickerStep('lane');
    
    // Reset form inputs
    const matchDateInput = document.getElementById('match-date-input');
    const winnerInput = document.getElementById('winner-input');
    const blueTeamInput = document.getElementById('blue-team-input');
    const redTeamInput = document.getElementById('red-team-input');
    
    if (matchDateInput) matchDateInput.value = '';
    if (winnerInput) winnerInput.value = '';
    if (blueTeamInput) blueTeamInput.value = '';
    if (redTeamInput) redTeamInput.value = '';
  }

  // Function to start the pick flow
  function startPickFlow(team, pickNum) {
    const maxPicks = pickNum === 1 ? 3 : 2; // Phase 1: 3 picks, Phase 2: 2 picks
    const currentPicks = Array.isArray(picks[team][pickNum]) ? picks[team][pickNum] : [];
    const remainingPicks = maxPicks - currentPicks.length;
    
    if (remainingPicks > 0) {
      setCurrentPickSession({
        team,
        pickNum,
        remainingPicks,
        maxPicks
      });
      setPickFlowState('lane-selection');
      setPickerStep('lane'); // Start with lane selection
      setHeroPickerMode(null); // Reset hero picker mode to ensure we start with lane selection
      setHeroPickerTarget(null); // Reset hero picker target to prevent banning modal from showing
      setModalState('heroPicker'); // Set modal state to enable the pick flow
    }
  }

  // Function to handle lane selection in pick flow
  function handleLaneSelection(lane) {
    setPickTarget({ team: currentPickSession.team, pickNum: currentPickSession.pickNum, lane });
    setHeroPickerMode('pick');
    setPickFlowState('hero-selection');
    setPickerStep('hero'); // Move to hero selection step
    setModalState('heroPicker');
  }

  // Function to handle hero selection in pick flow
  function handleHeroSelection(selectedHero) {
    if (selectedHero && selectedHero.length > 0) {
      const hero = selectedHero[0];
      setPicks(prev => ({
        ...prev,
        [currentPickSession.team]: {
          ...prev[currentPickSession.team],
          [currentPickSession.pickNum]: [
            ...((Array.isArray(prev[currentPickSession.team][currentPickSession.pickNum]) ? prev[currentPickSession.team][currentPickSession.pickNum] : [])),
            { lane: pickTarget.lane, hero: hero }
          ]
        }
      }));

      // Check if we need to continue picking
      const newRemainingPicks = currentPickSession.remainingPicks - 1;
      if (newRemainingPicks > 0) {
        // Continue with next pick - go back to lane selection
        setCurrentPickSession(prev => ({
          ...prev,
          remainingPicks: newRemainingPicks
        }));
        setPickFlowState('lane-selection');
        setPickerStep('lane'); // Go back to lane selection step
        setHeroPickerMode(null); // Reset hero picker mode
        setModalState('heroPicker'); // Reopen modal in lane-select mode
      } else {
        // All picks complete, close the flow
        setPickFlowState('none');
        setCurrentPickSession(null);
        setPickerStep('lane'); // Reset step
        setModalState('export');
        setHeroPickerMode(null);
      }
    }
  }

  async function handleExportConfirm() {
    // Gather values from your state and inputs
    const matchDate = document.getElementById('match-date-input').value;
    const winner = document.getElementById('winner-input').value;
    const blueTeam = document.getElementById('blue-team-input').value;
    const redTeam = document.getElementById('red-team-input').value;

    // Basic validation
    if (!matchDate || !winner || !blueTeam || !redTeam) {
      alert('Please fill in all required fields: Date, Results, Blue Team, and Red Team');
      return;
    }

    // Get player assignments for blue and red teams from localStorage
    let bluePlayers = [];
    let redPlayers = [];
    try {
      const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
      if (latestTeam && latestTeam.teamName && latestTeam.players) {
        if (latestTeam.teamName === blueTeam) bluePlayers = latestTeam.players;
        if (latestTeam.teamName === redTeam) redPlayers = latestTeam.players;
      }
      // If you support multiple teams in localStorage, you may need to adjust this logic
    } catch (e) {}

    // Helper to get player name by lane for a team
    const getPlayerName = (playersArr, laneKey) => {
      if (!Array.isArray(playersArr)) return '';
      const found = playersArr.find(p => p.role === laneKey);
      return found && found.name ? found.name : '';
    };

    // Use your state for bans and picks
    const payload = {
      match_date: matchDate,
      winner: winner,
      turtle_taken: (turtleTakenBlue || turtleTakenRed) ? `${turtleTakenBlue || 0}-${turtleTakenRed || 0}` : null,
      lord_taken: (lordTakenBlue || lordTakenRed) ? `${lordTakenBlue || 0}-${lordTakenRed || 0}` : null,
      notes: notes,
      playstyle: playstyle,
      teams: [
        {
          team: blueTeam,
          team_color: "blue",
          banning_phase1: banning.blue1,
          picks1: picks.blue[1].map(p => ({
            team: blueTeam,
            lane: p.lane,
            hero: p.hero,
            player: getPlayerName(bluePlayers, p.lane)
          })),
          banning_phase2: banning.blue2,
          picks2: picks.blue[2].map(p => ({
            team: blueTeam,
            lane: p.lane,
            hero: p.hero,
            player: getPlayerName(bluePlayers, p.lane)
          }))
        },
        {
          team: redTeam,
          team_color: "red",
          banning_phase1: banning.red1,
          picks1: picks.red[1].map(p => ({
            team: redTeam,
            lane: p.lane,
            hero: p.hero,
            player: getPlayerName(redPlayers, p.lane)
          })),
          banning_phase2: banning.red2,
          picks2: picks.red[2].map(p => ({
            team: redTeam,
            lane: p.lane,
            hero: p.hero,
            player: getPlayerName(redPlayers, p.lane)
          }))
        }
      ]
    };

    try {
      console.log('Sending payload:', payload); // Debug log
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        // Save the exported match to localStorage for Player Statistics
        localStorage.setItem('latestMatch', JSON.stringify(payload));
        setModalState('none');
        setTurtleTakenBlue('');
        setTurtleTakenRed('');
        setLordTakenBlue('');
        setLordTakenRed('');
        setNotes('');
        setPlaystyle('');
        // Refetch all matches and sort latest to oldest
        fetch('/api/matches')
          .then(res => res.json())
          .then(allMatches => {
            if (allMatches && allMatches.length > 0) {
              allMatches.sort((a, b) => {
                if (a.match_date === b.match_date) return b.id - a.id;
                return new Date(b.match_date) - new Date(a.match_date);
              });
              setMatches(allMatches);
            }
          });
      } else {
        // Get the error response from the server
        const errorData = await response.text();
        console.error('Server error:', response.status, errorData);
        alert(`Failed to export match: ${response.status} - ${errorData}`);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error: ' + err.message);
    }
  }

  React.useEffect(() => {
    if (modalState === 'export' || modalState === 'heroPicker') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalState]);

  // Delete match handler
  async function handleDeleteMatch(matchId) {
    try {
      const response = await fetch(`/api/matches/${matchId}`, { method: 'DELETE' });
      if (response.ok) {
        setMatches(prev => prev.filter(m => m.id !== matchId));
        setModalState('none');
        setDeleteConfirmMatch(null);
      } else {
        const errorData = await response.text();
        console.error('Server error:', response.status, errorData);
        alert(`Failed to delete match: ${response.status} - ${errorData}`);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error: ' + err.message);
    }
  }

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
          background: 'transparent', // No background, blends with page
          boxShadow: 'none',
        }}
      >
        {/* Logo and Title */}
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
      <main className="flex flex-col items-center px-2 flex-1" style={{ marginTop: 80, paddingTop: 0 }}>
        <div className="flex flex-col items-center w-full">
          <div className="w-[1600px] max-w-[95vw] mx-auto p-4 rounded-2xl" style={{ background: '#23232a', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)', border: '1px solid #23283a', marginTop: 0 }}>
            {/* Top-left controls */}
            <div className="flex flex-row items-center mb-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow transition flex items-center mr-4"
                onClick={() => setModalState('export')}
              >
              Export Match
            </button>
              <select
                className="ml-2 px-4 py-2 rounded bg-gray-800 text-blue-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedTeam}
                onChange={e => setSelectedTeam(e.target.value)}
              >
                {allTeams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
              <h1 className="text-2xl font-bold text-blue-200 ml-4">Cody Banks Draft and Statistics System</h1>
          </div>
            {/* Scrollable Table Container */}
            <div style={{ maxHeight: '650px', overflowY: 'auto', borderRadius: '1rem', marginBottom: 8, paddingBottom: 8, scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }} className="hide-scrollbar-buttons">
              <table className="w-full text-sm whitespace-nowrap">
                <thead className="sticky top-0 z-10" style={{ background: '#23283a' }}>
                  <tr>
                    <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[120px] rounded-tl-xl">DATE</th>
                    <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[120px]">RESULTS</th>
                    <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[120px]">TEAM</th>
                    <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[220px]">Banning Phase 1</th>
                    <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[220px]">Picks</th>
                    <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[220px]">Banning Phase 2</th>
                    <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[220px] rounded-tr-xl">Picks</th>
                    <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[60px]">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <React.Fragment key={match.id}>
                      {match.teams.map((team, idx) => (
                        <tr
                          key={team.id}
                          data-match-id={match.id}
                          className={
                            `transition-colors duration-200 rounded-lg ` +
                            (hoveredMatchId === match.id ? 'bg-blue-900/30' : '')
                          }
                          onMouseEnter={() => setHoveredMatchId(match.id)}
                          onMouseLeave={() => setHoveredMatchId(null)}
                        >
                          {idx === 0 && (
                            <>
                              <td className="py-3 px-4 text-center align-middle" rowSpan={match.teams.length}>{match.match_date}</td>
                              <td className="py-3 px-4 text-center align-middle" rowSpan={match.teams.length}>
                                <span className="inline-block text-white px-4 py-1 rounded-full font-bold shadow-md" style={{ background: '#22c55e' }}>
                                  {match.winner}
                                </span>
                              </td>
                            </>
                          )}
                          <td className="py-3 px-1 text-center font-bold align-middle">
                            {team.team_color === 'blue' ? (
                              <span className="relative group inline-block bg-blue-500 text-white px-3 py-1 rounded font-bold cursor-pointer focus:outline-none" tabIndex={0} aria-label="1st Pick">
                                {team.team}
                                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max px-3 py-1 bg-black text-sm text-white rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                                  1st Pick
                                </span>
                              </span>
                            ) : (
                              <span className="inline-block bg-red-500 text-white px-3 py-1 rounded font-bold">
                                {team.team}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-1 text-center align-middle min-w-[120px]">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                              {Array.isArray(team.banning_phase1)
                                ? team.banning_phase1.map(heroName => {
                                    const hero = heroList.find(h => h.name === heroName);
                                    return hero ? (
                                      <ModalBanHeroIcon key={heroName} src={`/heroes/${hero.role}/${hero.image}`} alt={heroName} />
                                    ) : null;
                                  })
                                : null}
                            </div>
                          </td>
                          <td className="py-3 px-1 text-center align-middle min-w-[140px]">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                              {Array.isArray(team.picks1)
                                ? team.picks1.map(pickObj => {
                                    const heroName = typeof pickObj === 'string' ? pickObj : pickObj.hero;
                                    const hero = heroList.find(h => h.name === heroName);
                                    return hero ? (
                                      <img
                                        key={heroName}
                                        src={`/heroes/${hero.role}/${hero.image}`}
                                        alt={heroName}
                                        style={{
                                          width: 56,
                                          height: 56,
                                          borderRadius: '50%',
                                          objectFit: 'cover',
                                          border: '2px solid #22c55e',
                                          background: '#181A20'
                                        }}
                                      />
                                    ) : null;
                                  })
                                : null}
                            </div>
                          </td>
                          <td className="py-3 px-1 text-center align-middle min-w-[140px]">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                              {Array.isArray(team.banning_phase2)
                                ? team.banning_phase2.map(heroName => {
                                    const hero = heroList.find(h => h.name === heroName);
                                    return hero ? (
                                      <ModalBanHeroIcon key={heroName} src={`/heroes/${hero.role}/${hero.image}`} alt={heroName} />
                                    ) : null;
                                  })
                                : null}
                            </div>
                          </td>
                          <td className="py-3 px-1 text-center align-middle min-w-[140px]">
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                              {Array.isArray(team.picks2)
                                ? team.picks2.map(pickObj => {
                                    const heroName = typeof pickObj === 'string' ? pickObj : pickObj.hero;
                                    const hero = heroList.find(h => h.name === heroName);
                                    return hero ? (
                                      <img
                                        key={heroName}
                                        src={`/heroes/${hero.role}/${hero.image}`}
                                        alt={heroName}
                                        style={{
                                          width: 56,
                                          height: 56,
                                          borderRadius: '50%',
                                          objectFit: 'cover',
                                          border: '2px solid #22c55e',
                                          background: '#181A20'
                                        }}
                                      />
                                    ) : null;
                                  })
                                : null}
                            </div>
                          </td>
                         {/* Delete button: only show on first team row for each match */}
                         {idx === 0 && (
                           <td className="py-3 px-4 text-center align-middle" rowSpan={match.teams.length}>
                             <button
                               onClick={() => {
                                 setDeleteConfirmMatch(match);
                                 setModalState('deleteConfirm');
                               }}
                               className="text-red-500 hover:text-red-700 focus:outline-none"
                               title="Delete match"
                             >
                               <FaTrash size={20} />
                             </button>
                           </td>
                         )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {(modalState === 'export' || modalState === 'heroPicker') && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-70">
          <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: 'rgba(30, 41, 59, 0.85)', zIndex: 1000 }} onClick={() => setModalState('none')} />
          <div className="modal-box w-full max-w-[110rem] rounded-2xl shadow-2xl p-8 px-20" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1001, borderRadius: 24, background: '#101014', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Focus trap to prevent date input from being auto-focused */}
            <button
              type="button"
              tabIndex={0}
              style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
              aria-hidden="true"
              id="modal-focus-trap"
            />
            <h2 className="text-2xl font-bold text-white mb-6">Data Draft Input</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-7 gap-6 items-center text-white text-sm font-semibold mb-2">
                <label className="col-span-1">Date</label>
                <label className="col-span-1">Results</label>
                <label className="col-span-1">Team</label>
                <label className="col-span-1">Banning phase 1</label>
                <label className="col-span-1">Pick</label>
                <label className="col-span-1">Banning phase 2</label>
                <label className="col-span-1">Pick</label>
              </div>
              {/* Row 1: Blue Team */}
              <div className="grid grid-cols-7 gap-6 items-center mb-2">
                {/* Date Picker */}
                <div className="relative flex items-center bg-[#181A20] rounded px-2 py-1">
                  <input
                    type="date"
                    className="bg-transparent text-white rounded w-full focus:outline-none pr-8"
                    id="match-date-input"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 focus:outline-none"
                    tabIndex={-1}
                    aria-label="Pick date"
                    onClick={() => document.getElementById('match-date-input').showPicker && document.getElementById('match-date-input').showPicker()}
                  >
                    {/* SVG calendar icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a.75.75 0 00.75-.75V6.75A2.25 2.25 0 0018 4.5H6A2.25 2.25 0 003.75 6.75v13.5c0 .414.336.75.75.75z" />
                    </svg>
                  </button>
                </div>
                {/* Winner Field */}
                <input type="text" placeholder="Winner" className="bg-[#181A20] text-white rounded px-2 py-1 w-full focus:outline-none" id="winner-input" />
                {/* Blue Team */}
                <div className="flex items-center bg-[#181A20] rounded px-2 py-1">
                  <span className="mr-2 text-blue-400 text-lg">🔵</span>
                  <input type="text" placeholder="Blue Team" className="bg-transparent text-white rounded focus:outline-none w-full" id="blue-team-input" />
                </div>
                {/* Banning Phase 1 */}
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => { setHeroPickerTarget('blue1'); setHeroPickerMode('ban'); setModalState('heroPicker'); }}
                >
                  {banning.blue1.length === 0 ? 'Choose a hero to ban' : banning.blue1.join(', ')}
                </button>
                {/* Pick 1 */}
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => startPickFlow('blue', 1)}
                >
                  {Array.isArray(picks.blue[1]) && picks.blue[1].length > 0
                    ? picks.blue[1].filter(p => p && p.lane && p.hero).map(p => p.hero).join(', ')
                    : 'Choose a hero to pick'}
                </button>
                {/* Banning Phase 2 */}
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => { setHeroPickerTarget('blue2'); setHeroPickerMode('ban'); setModalState('heroPicker'); }}
                >
                  {banning.blue2.length === 0 ? 'Choose a hero to ban' : banning.blue2.join(', ')}
                </button>
                {/* Pick 2 */}
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => startPickFlow('blue', 2)}
                >
                  {Array.isArray(picks.blue[2]) && picks.blue[2].filter(p => p && p.hero).length > 0
                    ? picks.blue[2].filter(p => p && p.hero).map(p => p.hero).join(', ')
                    : 'Choose a hero to pick'}
                </button>
              </div>
              {/* Row 2: Red Team */}
              <div className="grid grid-cols-7 gap-6 items-center mb-2">
                <div></div>
                <div></div>
                {/* Red Team */}
                <div className="flex items-center bg-[#181A20] rounded px-2 py-1">
                  <span className="mr-2 text-red-400 text-lg">🔴</span>
                  <input type="text" placeholder="Red Team" className="bg-transparent text-white rounded focus:outline-none w-full" id="red-team-input" />
                </div>
                {/* Banning Phase 1 */}
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => { setHeroPickerTarget('red1'); setHeroPickerMode('ban'); setModalState('heroPicker'); }}
                >
                  {banning.red1.length === 0 ? 'Choose a hero to ban' : banning.red1.join(', ')}
                </button>
                {/* Pick 1 */}
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => startPickFlow('red', 1)}
                >
                  {Array.isArray(picks.red[1]) && picks.red[1].length > 0
                    ? picks.red[1].filter(p => p && p.lane && p.hero).map(p => p.hero).join(', ')
                    : 'Choose a hero to pick'}
                </button>
                {/* Banning Phase 2 */}
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => { setHeroPickerTarget('red2'); setHeroPickerMode('ban'); setModalState('heroPicker'); }}
                >
                  {banning.red2.length === 0 ? 'Choose a hero to ban' : banning.red2.join(', ')}
                </button>
                {/* Pick 2 */}
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => startPickFlow('red', 2)}
                >
                  {Array.isArray(picks.red[2]) && picks.red[2].filter(p => p && p.hero).length > 0
                    ? picks.red[2].filter(p => p && p.hero).map(p => p.hero).join(', ')
                    : 'Choose a hero to pick'}
                </button>
              </div>
              {/* Turtle/Lord taken, Notes, Playstyle */}
              <div className="flex flex-wrap items-center gap-8 mt-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent select-none">
                      Turtle taken
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400 font-semibold text-sm">Blue:</span>
                        <input 
                          type="number" 
                          min="0" 
                          max="10"
                          className="w-16 bg-[#181A20] text-blue-400 border border-blue-500 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400" 
                          value={turtleTakenBlue} 
                          onChange={e => setTurtleTakenBlue(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <span className="text-white font-bold">-</span>
                      <div className="flex items-center gap-1">
                        <span className="text-red-400 font-semibold text-sm">Red:</span>
                        <input 
                          type="number" 
                          min="0" 
                          max="10"
                          className="w-16 bg-[#181A20] text-red-400 border border-red-500 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-400" 
                          value={turtleTakenRed} 
                          onChange={e => setTurtleTakenRed(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent select-none">
                      Lord taken
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400 font-semibold text-sm">Blue:</span>
                        <input 
                          type="number" 
                          min="0" 
                          max="10"
                          className="w-16 bg-[#181A20] text-blue-400 border border-blue-500 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400" 
                          value={lordTakenBlue} 
                          onChange={e => setLordTakenBlue(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <span className="text-white font-bold">-</span>
                      <div className="flex items-center gap-1">
                        <span className="text-red-400 font-semibold text-sm">Red:</span>
                        <input 
                          type="number" 
                          min="0" 
                          max="10"
                          className="w-16 bg-[#181A20] text-red-400 border border-red-500 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-400" 
                          value={lordTakenRed} 
                          onChange={e => setLordTakenRed(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex items-start">
                  <label className="mr-2 text-white font-semibold mt-1">Notes:</label>
                  <textarea placeholder="Notes" className="bg-[#181A20] text-white rounded-xl px-4 py-2 w-full focus:outline-none resize-none" style={{height: '120px'}} value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
                <div className="flex items-center">
                  <label className="mr-2 text-white font-semibold">Playstyle:</label>
                  <input type="text" placeholder="Playstyle" className="bg-[#181A20] text-white rounded-full px-4 py-1 w-32 focus:outline-none" value={playstyle} onChange={e => setPlaystyle(e.target.value)} />
                </div>
              </div>
              <div className="modal-action mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                  onClick={handleExportConfirm}
                >
                  Confirm
                </button>
                <button 
                  type="button" 
                  className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold" 
                  onClick={() => {
                    resetFormData();
                    setModalState('none');
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalState === 'heroPicker' && pickerStep === 'lane' && currentPickSession && (
        <LaneSelectModal
          open={true}
          onClose={() => {
            setModalState('export');
            setPickFlowState('none');
            setCurrentPickSession(null);
            setPickerStep('lane');
          }}
          availableLanes={(() => {
            // For pick phase 2, filter out lanes already picked in phase 1 for the same team
            const currentTeam = currentPickSession.team;
            const currentPickNum = currentPickSession.pickNum;
            let usedLanes = [];
            if (currentPickNum === 2) {
              usedLanes = (Array.isArray(picks[currentTeam][1]) ? picks[currentTeam][1] : []).map(p => p && p.lane).filter(Boolean);
            }
            // Also filter out lanes already picked in this phase
            const alreadyPicked = (Array.isArray(picks[currentTeam][currentPickNum]) ? picks[currentTeam][currentPickNum] : []).map(p => p && p.lane).filter(Boolean);
            return LANE_OPTIONS.filter(lane => !usedLanes.includes(lane.key) && !alreadyPicked.includes(lane.key));
          })()}
          onSelect={handleLaneSelection}
          currentPickSession={currentPickSession}
        />
      )}
      {/* Show HeroPickerModal for banning */}
      {modalState === 'heroPicker' && heroPickerMode === 'ban' && heroPickerTarget && !currentPickSession && (
        <HeroPickerModal
          open={true}
          onClose={() => setModalState('export')}
          selected={banning[heroPickerTarget] || []}
          setSelected={selected => {
            setBanning(prev => ({
              ...prev,
              [heroPickerTarget]: selected
            }));
          }}
          maxSelect={heroPickerTarget.endsWith('1') ? 3 : 2}
          bannedHeroes={Object.values(banning).flat().filter((h, i, arr) => arr.indexOf(h) !== i ? false : true)}
          heroList={heroList}
          heroPickerMode={heroPickerMode}
          pickTarget={pickTarget}
          picks={picks}
          banning={banning}
          heroPickerTarget={heroPickerTarget}
        />
      )}
      {/* Show HeroPickerModal for picks */}
      {modalState === 'heroPicker' && pickerStep === 'hero' && pickTarget && pickTarget.lane && currentPickSession && (
        <HeroPickerModal
          open={true}
          onClose={() => {
            setModalState('export');
            setPickFlowState('none');
            setCurrentPickSession(null);
            setPickerStep('lane');
          }}
          selected={[]}
          setSelected={handleHeroSelection}
          maxSelect={1}
          bannedHeroes={Object.values(banning).flat()}
          filterType={LANE_TYPE_MAP[pickTarget.lane]}
          heroList={heroList}
          heroPickerMode={heroPickerMode}
          pickTarget={pickTarget}
          picks={picks}
          banning={banning}
          heroPickerTarget={heroPickerTarget}
        />
      )}
      {/* Delete Confirmation Modal */}
      {modalState === 'deleteConfirm' && deleteConfirmMatch && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
          <div className="modal-box w-full max-w-md bg-[#23232a] rounded-2xl shadow-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">Archive Match</h3>
            <div className="mb-6">
              <p className="text-white mb-2">Are you sure you want to archive this match?</p>
              <div className="bg-[#181A20] rounded-lg p-4 border border-gray-600">
                <div className="text-sm text-gray-300">
                  <div><strong>Date:</strong> {deleteConfirmMatch.match_date}</div>
                  <div><strong>Winner:</strong> {deleteConfirmMatch.winner}</div>
                  <div><strong>Teams:</strong> {deleteConfirmMatch.teams?.map(t => t.team).join(' vs ') || 'N/A'}</div>
                </div>
              </div>
              <p className="text-blue-400 text-sm mt-3">
                ✅ This match will be archived (hidden from view) but data will be preserved for player statistics and reports.
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="btn bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold"
                onClick={() => handleDeleteMatch(deleteConfirmMatch.id)}
              >
                Archive Match
              </button>
              <button
                type="button"
                className="btn bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold"
                onClick={() => {
                  setModalState('none');
                  setDeleteConfirmMatch(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hover modal for match details */}
      {hoveredMatchId && (() => {
        const match = matches.find(m => m.id === hoveredMatchId);
        if (!match) return null;
        // Find the DOM node for the hovered row
        const row = document.querySelector(`tr[data-match-id='${hoveredMatchId}']`);
        let top = 200, left = 1200; // fallback values
        const modalHeight = 520; // Approximate modal height
        if (row) {
          const rect = row.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          left = rect.left + window.scrollX + rect.width / 2;
          // Default: below the row
          let desiredTop = rect.bottom + 16;
          // If it would overflow bottom, show above
          if (desiredTop + modalHeight > viewportHeight + window.scrollY) {
            desiredTop = rect.top + window.scrollY - modalHeight - 16;
            if (desiredTop < window.scrollY + 16) desiredTop = window.scrollY + 16; // Clamp to top
          }
          top = desiredTop;
        }
        // Prepare team data
        const blueTeam = match.teams.find(t => t.team_color === 'blue');
        const redTeam = match.teams.find(t => t.team_color === 'red');
        // Helper to get hero image
        const getHeroImg = (heroName) => {
          const hero = heroList.find(h => h.name === heroName);
          return hero ? `/heroes/${hero.role}/${hero.image}` : null;
        };
        // Combine bans (max 5)
        const getBans = (team) => {
          const bans = [...(team.banning_phase1 || []), ...(team.banning_phase2 || [])];
          while (bans.length < 5) bans.push(null);
          return bans.slice(0, 5);
        };
        // Combine picks (vertical)
        const getPicks = (team) => {
          return [...(team.picks1 || []), ...(team.picks2 || [])];
        };
        return (
          <div
            style={{
              position: 'fixed',
              left: left,
              top: top,
              transform: 'translate(-50%, 0)',
              zIndex: 9999,
              background: '#23232a',
              color: 'white',
              borderRadius: 12,
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)',
              padding: 24,
              minWidth: 600,
              pointerEvents: 'none',
              transition: 'top 0.1s, left 0.1s',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Visual Draft View */}
            <div style={{
              display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: 600, marginBottom: 24,
              background: '#133366',
              borderRadius: 32,
              boxShadow: '0 8px 32px 0 rgba(30,40,80,0.45)',
              border: '2px solid #2a3757',
              padding: '32px 24px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Floor bar at the bottom */}
              <div style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                height: 40,
                background: '#1a3a6b',
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                zIndex: 0,
              }} />
              {/* Team 1 (Blue) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120, zIndex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#60a5fa', marginBottom: 8, fontSize: 18 }}>{blueTeam?.team || 'Team 1'}</div>
                {/* Bans for Blue Team */}
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 12, marginLeft: 96 }}>
                  {getBans(blueTeam).map((heroName, idx) => {
                    const img = getHeroImg(heroName);
                    return (
                      <div key={idx} style={{ margin: 0 }}>
                        {img ? (
                          <ModalBanHeroIcon src={img} alt={heroName} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#23283a', border: '2px solid #23283a' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Picks vertical */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {getPicks(blueTeam).map((pickObj, idx) => {
                    const heroName = typeof pickObj === 'string' ? pickObj : pickObj.hero;
                    const img = getHeroImg(heroName);
                    return (
                      <div key={idx} style={{ margin: 0 }}>
                        {img ? (
                          <img src={img} alt={heroName} style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #22c55e', background: '#181A20', objectFit: 'cover', boxShadow: '0 2px 8px #0002', transition: 'transform 0.15s', pointerEvents: 'auto' }} className="hover:scale-110 hover:shadow-lg" />
                        ) : (
                          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#181A20', border: '2px solid #23283a' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Team 2 (Red) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120, zIndex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#f87171', marginBottom: 8, fontSize: 18 }}>{redTeam?.team || 'Team 2'}</div>
                {/* Bans for Red Team */}
                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: 12, marginRight: 96 }}>
                  {getBans(redTeam).map((heroName, idx) => {
                    const img = getHeroImg(heroName);
                    return (
                      <div key={idx} style={{ margin: 0 }}>
                        {img ? (
                          <ModalBanHeroIcon src={img} alt={heroName} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#23283a', border: '2px solid #23283a' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Picks vertical */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {getPicks(redTeam).map((pickObj, idx) => {
                    const heroName = typeof pickObj === 'string' ? pickObj : pickObj.hero;
                    const img = getHeroImg(heroName);
                    return (
                      <div key={idx} style={{ margin: 0 }}>
                        {img ? (
                          <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: '#181A20', border: '2px solid #f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0002', transition: 'transform 0.15s', pointerEvents: 'auto' }} className="hover:scale-110 hover:shadow-lg">
                            <img src={img} alt={heroName} style={{ width: '100%', height: '100%', objectFit: 'cover', border: 'none' }} />
                          </div>
                        ) : (
                          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#181A20', border: '2px solid #23283a' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Old text info */}
            <div><b>Turtle taken:</b> {match.turtle_taken ?? 'N/A'}</div>
            <div><b>Lord taken:</b> {match.lord_taken ?? 'N/A'}</div>
            <div><b>Playstyle:</b> {match.playstyle ?? 'N/A'}</div>
            <div><b>Notes:</b> {match.notes ?? 'N/A'}</div>
          </div>
        );
      })()}
    </div>
  );
}

// Hero Picker Modal
function HeroPickerModal({ open, onClose, selected, setSelected, maxSelect = 1, bannedHeroes = [], filterType = null, heroList = [], heroPickerMode, pickTarget, picks, banning, heroPickerTarget, currentPickSession }) {
  const [selectedType, setSelectedType] = React.useState('All');
  const [showFlexPicks, setShowFlexPicks] = React.useState(false);
  const [localSelected, setLocalSelected] = React.useState(selected);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setLocalSelected(selected);
      setSearchTerm(''); // Reset search when modal opens
      setShowFlexPicks(false); // Reset flex picks state
      // For picking, default to lane type (e.g., "Fighter" for Exp Lane)
      // For banning, default to "All"
      if (heroPickerMode === 'pick' && filterType) {
        setSelectedType(filterType);
      } else {
        setSelectedType('All');
      }
    }
  }, [open, selected, heroPickerMode, filterType]);

  if (!open) return null;
  const toggleHero = (heroName) => {
    if (localSelected.includes(heroName)) {
      setLocalSelected(localSelected.filter(h => h !== heroName));
    } else if (localSelected.length < maxSelect) {
      setLocalSelected([...localSelected, heroName]);
    }
  };
  const canConfirm = localSelected.length === maxSelect;
  let filteredHeroes = heroList;
  
  // Apply role filter - prioritize user selection over filterType
  if (selectedType !== 'All') {
    // User selected a specific type, use that
    filteredHeroes = filteredHeroes.filter(hero => hero.role === selectedType);
  } else if (showFlexPicks) {
    // User clicked "All Heroes" for flex picks - show all heroes
    // Don't filter by role - show all heroes
  } else {
    // User selected "All" - show heroes based on filterType (lane type)
    // For Exp Lane: show Fighter heroes when "All" is clicked
    if (filterType) {
      filteredHeroes = filteredHeroes.filter(hero => hero.role === filterType);
    }
  }

  // Apply search filter
  if (searchTerm.trim()) {
    filteredHeroes = filteredHeroes.filter(hero => 
      hero.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Get all unavailable heroes (banned or picked)
  const allBannedHeroes = Object.values(banning).flat().filter(Boolean);
  const allPickedHeroes = [
    ...(Array.isArray(picks.blue[1]) ? picks.blue[1] : []),
    ...(Array.isArray(picks.blue[2]) ? picks.blue[2] : []),
    ...(Array.isArray(picks.red[1]) ? picks.red[1] : []),
    ...(Array.isArray(picks.red[2]) ? picks.red[2] : [])
  ].map(p => p && p.hero).filter(Boolean);
  
  const unavailableHeroes = [...allBannedHeroes, ...allPickedHeroes];
  
  // Don't filter out unavailable heroes - show them as disabled instead
  // filteredHeroes = filteredHeroes.filter(hero => !unavailableHeroes.includes(hero.name));

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
      <div className="modal-box w-full max-w-5xl bg-[#23232a] rounded-2xl shadow-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-2">
          Select {maxSelect} Hero{maxSelect > 1 ? 'es' : ''}
          {selectedType !== 'All' 
            ? ` (${selectedType})` 
            : showFlexPicks
              ? ` (All Heroes for ${filterType} Lane)` 
              : heroPickerMode === 'pick' && filterType
                ? ` (${filterType})` 
                : ' (All Heroes)'
          }
        </h3>
        
        {/* Hero availability summary */}
        <div className="mb-4 p-3 bg-[#181A20] rounded-lg border border-gray-600">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white">
              Available: <span className="text-green-400 font-bold">{filteredHeroes.filter(hero => !unavailableHeroes.includes(hero.name)).length}</span>
            </span>
            <span className="text-red-400">
              Banned: <span className="font-bold">{allBannedHeroes.length}</span>
            </span>
            <span className="text-green-400">
              Picked: <span className="font-bold">{allPickedHeroes.length}</span>
            </span>
          </div>
        </div>

        {/* Filter buttons - show for both banning and picking */}
        <div className="flex gap-2 mb-6 flex-wrap items-center">
          <button
            type="button"
            className={`px-4 py-1 rounded-full font-semibold border ${selectedType === 'All' && !showFlexPicks ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-white border-gray-600 hover:bg-blue-900/20'}`}
            onClick={() => {
              setSelectedType('All');
              setShowFlexPicks(false);
            }}
          >
            {heroPickerMode === 'pick' && filterType ? filterType : 'All'}
          </button>
          {/* Show "All Heroes" button for flex picks when picking */}
          {heroPickerMode === 'pick' && filterType && (
            <button
              type="button"
              className={`px-4 py-1 rounded-full font-semibold border ${showFlexPicks ? 'bg-green-600 text-white border-green-600' : 'bg-transparent text-white border-gray-600 hover:bg-green-900/20'}`}
              onClick={() => {
                setSelectedType('All');
                setShowFlexPicks(true);
              }}
            >
              All Heroes
            </button>
          )}
          {/* Only show role filter buttons for banning, not for Exp Lane picking */}
          {heroPickerMode !== 'pick' && [...new Set(heroList.map(h => h.role))].map(type => (
            <button
              key={type}
              type="button"
              className={`px-4 py-1 rounded-full font-semibold border ${selectedType === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-white border-gray-600 hover:bg-blue-900/20'}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
          
          {/* Search Bar */}
          <div className="relative ml-4">
            <input
              type="text"
              placeholder="Search heroes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-1 bg-[#181A20] text-white rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pl-8 pr-3 w-48"
            />
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-9 gap-1 mb-6 max-h-[60vh] overflow-y-auto pr-2">
          {Array.from(new Map(filteredHeroes.map(hero => [hero.name, hero])).values()).map(hero => {
            const isBanned = allBannedHeroes.includes(hero.name);
            const isPicked = allPickedHeroes.includes(hero.name);
            const isUnavailable = isBanned || isPicked;
            const isSelected = localSelected.includes(hero.name);
            
            return (
              <button
                key={hero.name}
                type="button"
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all font-semibold ${
                  isBanned 
                    ? 'border-red-600 bg-red-900/30 text-red-400 cursor-not-allowed opacity-60' 
                    : isPicked 
                      ? 'border-green-600 bg-green-900/30 text-green-400 cursor-not-allowed opacity-60'
                      : isSelected 
                        ? 'border-green-400 bg-green-900/30 text-white' 
                        : 'border-transparent hover:border-blue-400 hover:bg-blue-900/20 text-white'
                }`}
                onClick={() => !isUnavailable && toggleHero(hero.name)}
                disabled={isUnavailable || (localSelected.length === maxSelect && !localSelected.includes(hero.name))}
                title={isBanned ? `${hero.name} is banned` : isPicked ? `${hero.name} is picked` : hero.name}
              >
                <div
                  className={`w-16 h-16 rounded-full shadow-lg overflow-hidden flex items-center justify-center mb-2 relative ${
                    isBanned 
                      ? 'bg-red-900' 
                      : isPicked 
                        ? 'bg-green-900'
                        : 'bg-gradient-to-b from-blue-900 to-blue-700'
                  }`}
                  style={!isUnavailable ? { background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)' } : {}}
                >
                  <HeroImage
                    src={`/heroes/${hero.role}/${hero.image}`}
                    alt={hero.name}
                  />
                  {isBanned && (
                    <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center rounded-full">
                      <span className="text-red-400 font-bold text-xs">BANNED</span>
                    </div>
                  )}
                  {isPicked && (
                    <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center rounded-full">
                      <span className="text-green-400 font-bold text-xs">PICKED</span>
                    </div>
                  )}
                </div>
                <span className={`text-sm font-semibold text-center w-20 truncate ${
                  isBanned ? 'text-red-400' : isPicked ? 'text-green-400' : 'text-white'
                }`}>
                  {hero.name}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
            disabled={!canConfirm}
            onClick={() => {
              if (canConfirm) {
                setSelected(localSelected);
                // Don't call onClose() for pick flow - let handleHeroSelection handle the continuation
                if (heroPickerMode !== 'pick') {
                  onClose();
                }
              }
            }}
          >
            Confirm
          </button>
          <button
            type="button"
            className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            onClick={() => { setLocalSelected([]); onClose(); }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Lane selection modal
function LaneSelectModal({ open, onClose, onSelect, availableLanes = LANE_OPTIONS, currentPickSession }) {
  if (!open) return null;
  
  const showProgress = currentPickSession && currentPickSession.remainingPicks > 0;
  const teamColor = currentPickSession?.team === 'blue' ? 'blue' : 'red';
  const teamEmoji = currentPickSession?.team === 'blue' ? '🔵' : '🔴';
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80">
      <div className="modal-box w-full max-w-md bg-[#23232a] rounded-2xl shadow-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-2">Select Lane</h3>
        
        {showProgress && (
          <div className="mb-4 p-3 bg-[#181A20] rounded-lg border border-gray-600">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white">
                {teamEmoji} {currentPickSession.team === 'blue' ? 'Blue' : 'Red'} Team - Phase {currentPickSession.pickNum}
              </span>
              <span className={`font-bold ${teamColor === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
                {currentPickSession.remainingPicks} of {currentPickSession.maxPicks} picks remaining
              </span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          {availableLanes.map(lane => (
            <button
              key={lane.key}
              type="button"
              className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-blue-600 hover:text-white transition-colors duration-150"
              onClick={() => onSelect(lane.key)}
            >
              {lane.label}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button type="button" className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
