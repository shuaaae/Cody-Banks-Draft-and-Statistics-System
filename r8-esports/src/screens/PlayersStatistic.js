import React, { useEffect, useState, useRef, useCallback } from 'react';
import mobaImg from '../assets/moba1.jpg';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';

// Placeholder images (replace with your uploads later)
import defaultPlayer from '../assets/default.png';
import teamLogo from '../assets/teamlogo.jpg';
import expIcon from '../assets/exp.jpg';
import midIcon from '../assets/mid.jpg';
import junglerIcon from '../assets/jungle.jpg';
import goldIcon from '../assets/gold.jpg';
import roamIcon from '../assets/roam.jpg';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip);

// PlayerCard must be placed BEFORE PlayersStatistic
const PlayerCard = ({ lane, player, hero, highlight, onClick }) => {
  return (
    <button
      type="button"
      className="relative flex items-center bg-[#111216] shadow-lg transition-all duration-200 overflow-hidden w-[520px] h-[150px] p-0 cursor-pointer focus:outline-none"
      style={{ borderRadius: 0, minWidth: 0, border: 'none' }}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0 z-20" style={{ width: 140, height: 160, marginLeft: -30 }}>
        <img
          src={player.teamLogo}
          alt="Team Logo BG"
          className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
          style={{
            width: 400,
            height: 400,
            opacity: 0.3,
            zIndex: 1,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 16px #0008)'
          }}
        />
        <img
          src={player.photo ? player.photo : defaultPlayer}
          alt="Player"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140px] h-[160px] object-cover rounded-xl z-10"
          style={{ objectPosition: 'center' }}
        />
      </div>
      <div className="flex-1 ml-8 min-w-0 flex flex-col justify-center z-30">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-white text-[1.35rem] font-bold tracking-wide truncate leading-tight">{player.name}</div>
          <div className="flex flex-col items-end ml-4 min-w-[90px] mr-8">
            <img src={lane.icon} alt={lane.label} className="w-8 h-8 object-contain mb-1" />
            <span className="text-yellow-300 text-xs font-extrabold tracking-widest">{lane.label}</span>
          </div>
        </div>
        {/* Removed hero name from PlayerCard */}
      </div>
    </button>
  );
};

const LANES = [
  { key: 'exp', label: 'EXPLANE', icon: expIcon },
  { key: 'mid', label: 'MIDLANER', icon: midIcon },
  { key: 'jungler', label: 'JUNGLER', icon: junglerIcon },
  { key: 'gold', label: 'GOLD LANE', icon: goldIcon },
  { key: 'roam', label: 'ROAMER', icon: roamIcon },
];

const PLAYER = {
  name: 'DORAN',
  realName: 'JOSHUA GODALLE',
  photo: defaultPlayer,
  teamLogo: teamLogo,
};

export default function PlayersStatistic() {
  const navigate = useNavigate();
  const [lanePlayers, setLanePlayers] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);
  const [teamPlayers, setTeamPlayers] = useState(null);
  const fileInputRef = useRef();
  const [uploadingPlayer, setUploadingPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [heroStats, setHeroStats] = useState([]);
  const [allPlayerStats, setAllPlayerStats] = useState({}); // NEW: cache for all player stats
  const [heroH2HStats, setHeroH2HStats] = useState([]); // NEW: H2H stats

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data.map(p => ({ ...p, teamLogo }))));
  }, []);

  // Pre-fetch all player stats for the current team
  useEffect(() => {
    if (teamPlayers && teamPlayers.players && teamPlayers.teamName) {
      const fetchAllStats = async () => {
        const statsObj = {};
        await Promise.all(
          teamPlayers.players.map(async (p) => {
            if (!p.name) return;
            const res = await fetch(`/api/players/${encodeURIComponent(p.name)}/hero-stats-by-team?teamName=${encodeURIComponent(teamPlayers.teamName)}`);
            const data = await res.json();
            statsObj[p.name] = data;
          })
        );
        setAllPlayerStats(statsObj);
      };
      fetchAllStats();
    }
  }, [teamPlayers]);

  useEffect(() => {
    const latestMatch = JSON.parse(localStorage.getItem('latestMatch'));
    if (latestMatch && latestMatch.teams && latestMatch.teams.length > 0) {
      const team = latestMatch.teams[0];
      const picks = [
        ...(team.picks1 || []),
        ...(team.picks2 || [])
      ];
      setLanePlayers(picks);
    } else {
      setLanePlayers(null);
    }

    const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
    if (latestTeam && latestTeam.players) {
      setTeamPlayers(latestTeam);
    } else {
      setTeamPlayers(null);
    }
  }, []);

  const getCurrentTeamName = useCallback(() => {
    return teamPlayers && teamPlayers.teamName ? teamPlayers.teamName : 'Unknown Team';
  }, [teamPlayers]);

  // Use cached stats for modal, fallback to fetch if not available
  useEffect(() => {
    if (modalInfo && modalInfo.player && modalInfo.player.name) {
      const teamName = getCurrentTeamName();
      const cached = allPlayerStats[modalInfo.player.name];
      if (cached) {
        setHeroStats(cached);
      } else {
        fetch(`/api/players/${encodeURIComponent(modalInfo.player.name)}/hero-stats-by-team?teamName=${encodeURIComponent(teamName)}`)
          .then(res => res.json())
          .then(data => setHeroStats(data));
      }
    } else {
      setHeroStats([]);
    }
  }, [modalInfo, getCurrentTeamName, allPlayerStats]);

  // Fetch H2H stats for modal
  useEffect(() => {
    if (modalInfo && modalInfo.player && modalInfo.player.name) {
      const teamName = getCurrentTeamName();
      fetch(`/api/players/${encodeURIComponent(modalInfo.player.name)}/hero-h2h-stats-by-team?teamName=${encodeURIComponent(teamName)}`)
        .then(res => res.json())
        .then(data => setHeroH2HStats(data));
    } else {
      setHeroH2HStats([]);
    }
  }, [modalInfo, getCurrentTeamName]);

  function getPlayerNameForLane(laneKey, laneIdx) {
    if (!teamPlayers || !teamPlayers.players) return PLAYER.name;
    const found = teamPlayers.players.find(
      p => p.role && p.role.toLowerCase().includes(laneKey)
    );
    if (found && found.name) return found.name;
    if (teamPlayers.players[laneIdx] && teamPlayers.players[laneIdx].name) {
      return teamPlayers.players[laneIdx].name;
    }
    return PLAYER.name;
  }

  function getHeroForLaneByLaneKey(laneKey, lanePlayers) {
    if (!lanePlayers) return null;
    const found = Array.isArray(lanePlayers)
      ? lanePlayers.find(p => p && p.lane && p.lane.toLowerCase() === laneKey)
      : null;
    return found ? found.hero : null;
  }

  function handleFileSelect(e, playerName) {
    const file = e.target.files[0];
    if (!file || !playerName) return;
    const player = players.find(p => p.name === playerName);
    const playerId = player ? player.id : 1;
    setPendingPhoto({ file, playerName, playerId });
    setShowConfirmModal(true);
  }

  async function handleConfirmUpload() {
    if (!pendingPhoto) return;
    setUploadingPlayer(pendingPhoto.playerName);
    try {
      const formData = new FormData();
      formData.append('photo', pendingPhoto.file);
      formData.append('playerName', pendingPhoto.playerName);
      const response = await fetch(`/api/players/photo-by-name`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setPlayers(prev => {
          const idx = prev.findIndex(p => p.name === pendingPhoto.playerName);
          if (idx !== -1) {
            // Update existing player
            return prev.map(p =>
              p.name === pendingPhoto.playerName ? { ...p, photo: data.photo } : p
            );
          } else {
            // Add new player, include teamLogo property
            return [...prev, { ...data.player, teamLogo }];
          }
        });
        setTeamPlayers(prev => {
          if (!prev || !prev.players) return prev;
          return {
            ...prev,
            players: prev.players.map(p =>
              p.name === pendingPhoto.playerName ? { ...p, photo: data.photo } : p
            )
          };
        });
      } else {
        alert('Failed to upload photo');
      }
    } catch (err) {
      alert('Error uploading photo');
    }
    setUploadingPlayer(null);
    setPendingPhoto(null);
    setShowConfirmModal(false);
  }

  function handleCancelUpload() {
    setPendingPhoto(null);
    setShowConfirmModal(false);
  }

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
      {/* Header */}
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
            <button className="text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold">Players Statistic</button>
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/team-history')}>Team History</button>
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/weekly-report')}>Weekly Report</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-blue-300 mb-4">Team: {getCurrentTeamName()}</div>
        <div className="w-full flex flex-col items-center mt-12 space-y-4">
          <div className="flex flex-row justify-center gap-x-8 w-full">
            {(() => {
              const playerName = getPlayerNameForLane('exp', 0);
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName };
              return (
                <PlayerCard lane={LANES[0]} player={playerObj} hero={getHeroForLaneByLaneKey('exp', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[0], player: playerObj, hero: getHeroForLaneByLaneKey('exp', lanePlayers) })} />
              );
            })()}
            {(() => {
              const playerName = getPlayerNameForLane('mid', 1);
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName };
              return (
                <PlayerCard lane={LANES[1]} player={playerObj} hero={getHeroForLaneByLaneKey('mid', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[1], player: playerObj, hero: getHeroForLaneByLaneKey('mid', lanePlayers) })} />
              );
            })()}
          </div>
          <div className="flex flex-row justify-center w-full">
            {(() => {
              const playerName = getPlayerNameForLane('jungler', 2);
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName };
              return (
                <PlayerCard lane={LANES[2]} player={playerObj} hero={getHeroForLaneByLaneKey('jungler', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[2], player: playerObj, hero: getHeroForLaneByLaneKey('jungler', lanePlayers) })} />
              );
            })()}
          </div>
          <div className="flex flex-row justify-center gap-x-8 w-full">
            {(() => {
              const playerName = getPlayerNameForLane('gold', 3);
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName };
              return (
                <PlayerCard lane={LANES[3]} player={playerObj} hero={getHeroForLaneByLaneKey('gold', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[3], player: playerObj, hero: getHeroForLaneByLaneKey('gold', lanePlayers) })} />
              );
            })()}
            {(() => {
              const playerName = getPlayerNameForLane('roam', 4);
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName };
              return (
                <PlayerCard lane={LANES[4]} player={playerObj} hero={getHeroForLaneByLaneKey('roam', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[4], player: playerObj, hero: getHeroForLaneByLaneKey('roam', lanePlayers) })} />
              );
            })()}
          </div>
        </div>
      </div> {/* End of main content wrapper */}

      {/* Player modal */}
      {modalInfo && !showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#23232a] rounded-2xl shadow-2xl p-8 min-w-[1100px] max-w-[98vw] min-h-[420px] max-h-[90vh] relative flex flex-row items-center" style={{ width: '1300px' }}>
            <button className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold" onClick={() => setModalInfo(null)}>&times;</button>
            <div className="flex flex-col items-center justify-center mr-8">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={e => handleFileSelect(e, modalInfo.player.name)}
              />
              <img
                src={(() => {
                  const player = players.find(p => p.name === modalInfo.player.name);
                  return (player && player.photo) ? player.photo : modalInfo.player.photo;
                })()}
                alt="Player"
                className="w-[120px] h-[140px] object-cover mb-2 rounded-xl cursor-pointer"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                title="Click to upload new photo"
                style={{ opacity: uploadingPlayer === modalInfo.player.name ? 0.5 : 1, objectPosition: 'center' }}
              />
              {uploadingPlayer === modalInfo.player.name && <div className="text-blue-300 mb-2">Uploading...</div>}
            </div>
            {/* Right section: two columns (tables left, chart right) */}
            <div className="flex flex-row items-start justify-start flex-1 min-w-0 gap-8">
              {/* Left: Tables */}
              <div className="flex flex-col items-start justify-start flex-1 min-w-0">
                <div className="text-white text-xl font-bold mb-1">{modalInfo.player.name}</div>
                <div className="flex items-center gap-2 mb-2">
                  <img src={modalInfo.lane.icon} alt={modalInfo.lane.label} className="w-8 h-8 object-contain" />
                  <span className="text-yellow-300 text-base font-extrabold tracking-widest">{modalInfo.lane.label}</span>
                </div>
                {/* Hero stats table */}
                <div className="mt-4 w-full">
                  <div className="text-yellow-300 font-bold mb-2">PLAYER'S HERO SUCCESS RATE (Scrim)</div>
                  {heroStats.length > 0 ? (
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left px-2 py-1">Hero</th>
                          <th className="text-green-500 px-2 py-1">WIN</th>
                          <th className="text-red-500 px-2 py-1">LOSE</th>
                          <th className="px-2 py-1">TOTAL</th>
                          <th className="text-yellow-400 px-2 py-1">Success rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heroStats.map((row, idx) => (
                          <tr key={row.hero + idx}>
                            <td className="px-2 py-1 text-white font-semibold">{row.hero}</td>
                            <td className="px-2 py-1 text-green-400 text-center">{row.win}</td>
                            <td className="px-2 py-1 text-red-400 text-center">{row.lose}</td>
                            <td className="px-2 py-1 text-center">{row.total}</td>
                            <td className="px-2 py-1 text-yellow-300 text-center">{row.winrate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-gray-400">No hero stats available.</div>
                  )}
                </div>
                {/* H2H stats table */}
                {heroH2HStats.length > 0 && (
                  <div className="mt-8 w-full">
                    <div className="text-yellow-300 font-bold mb-2">PLAYER'S HERO SUCCESS RATE vs ENEMY (H2H)</div>
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left px-2 py-1">Hero Used</th>
                          <th className="text-left px-2 py-1">Enemy</th>
                          <th className="text-green-500 px-2 py-1">WIN</th>
                          <th className="text-red-500 px-2 py-1">LOSE</th>
                          <th className="px-2 py-1">TOTAL</th>
                          <th className="text-yellow-400 px-2 py-1">Success rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heroH2HStats.map((row, idx) => (
                          <tr key={row.player_hero + row.enemy_hero + idx}>
                            <td className="px-2 py-1 text-white font-semibold">{row.player_hero}</td>
                            <td className="px-2 py-1 text-blue-300 font-semibold">{row.enemy_hero}</td>
                            <td className="px-2 py-1 text-green-400 text-center">{row.win}</td>
                            <td className="px-2 py-1 text-red-400 text-center">{row.lose}</td>
                            <td className="px-2 py-1 text-center">{row.total}</td>
                            <td className="px-2 py-1 text-yellow-300 text-center">{row.winrate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="text-gray-300 text-left mt-2">
                  {heroStats.length === 0 && (
                    'More player/lane/hero details can go here.'
                  )}
                </div>
              </div>
              {/* Right: Chart */}
              {heroStats.length > 0 && (
                <div className="flex flex-col items-center justify-start min-w-[400px] max-w-[500px] w-full">
                  <div className="text-yellow-300 font-bold mb-2">PLAYER'S HERO PERFORMANCE CHART</div>
                  <Bar
                    data={{
                      labels: heroStats.map(row => row.hero),
                      datasets: [
                        {
                          label: 'WIN',
                          data: heroStats.map(row => row.win),
                          backgroundColor: '#3b82f6',
                        },
                        {
                          label: 'LOSE',
                          data: heroStats.map(row => row.lose),
                          backgroundColor: '#f87171',
                        },
                        {
                          label: 'TOTAL',
                          data: heroStats.map(row => row.total),
                          backgroundColor: '#22c55e',
                        },
                        {
                          label: 'SUCCESS RATE',
                          data: heroStats.map(row => row.winrate),
                          type: 'line',
                          borderColor: '#facc15',
                          backgroundColor: '#facc15',
                          yAxisID: 'y1',
                          fill: false,
                          tension: 0.4,
                          pointRadius: 4,
                          pointBackgroundColor: '#facc15',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        tooltip: { mode: 'index', intersect: false },
                      },
                      scales: {
                        y: { beginAtZero: true, title: { display: true, text: 'Count' } },
                        y1: {
                          beginAtZero: true,
                          position: 'right',
                          title: { display: true, text: 'Success Rate (%)' },
                          min: 0,
                          max: 100,
                          grid: { drawOnChartArea: false },
                        },
                      },
                    }}
                    height={350}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm modal LAST and highest z-index */}
      {showConfirmModal && pendingPhoto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90" style={{ pointerEvents: 'auto' }}>
          <div className="bg-[#23232a] rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-[90vw] flex flex-col items-center z-[10000]">
            <div className="text-white text-lg font-bold mb-4">Are you sure you want to use this photo?</div>
            <img
              src={URL.createObjectURL(pendingPhoto.file)}
              alt="Preview"
              className="w-[180px] h-[210px] object-cover mb-4 rounded-xl"
              style={{ objectPosition: 'center' }}
            />
            <div className="flex gap-6">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold" onClick={handleConfirmUpload}>Confirm</button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold" onClick={handleCancelUpload}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
