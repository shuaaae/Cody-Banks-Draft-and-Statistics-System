import React, { useEffect, useState } from 'react';
import mobaImg from '../assets/moba1.jpg';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';

// Placeholder images (replace with your uploads later)
import defaultPlayer from '../assets/playerphoto.png'; // Use the transparent PNG for player photo
import teamLogo from '../assets/teamlogo.jpg'; // Updated to use the uploaded team logo
import expIcon from '../assets/exp.jpg';
import midIcon from '../assets/mid.jpg';
import junglerIcon from '../assets/jungle.jpg';
import goldIcon from '../assets/gold.jpg';
import roamIcon from '../assets/roam.jpg';

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
  const [modalInfo, setModalInfo] = useState(null); // { lane, player, hero }
  const [teamPlayers, setTeamPlayers] = useState(null); // { teamName, players }

  useEffect(() => {
    // Read the latest exported match from localStorage
    const latestMatch = JSON.parse(localStorage.getItem('latestMatch'));
    if (latestMatch && latestMatch.teams && latestMatch.teams.length > 0) {
      // For simplicity, use the first team (blue) and first phase (picks1)
      // You can adjust this logic to support both teams or phases as needed
      const team = latestMatch.teams[0];
      const picks = team.picks1 || [];
      setLanePlayers(picks); // Now lanePlayers is picks1 array
    } else {
      setLanePlayers(null);
    }
    // Read the latest team/player names from localStorage
    const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
    if (latestTeam && latestTeam.players) {
      setTeamPlayers(latestTeam);
    } else {
      setTeamPlayers(null);
    }
  }, []);

  // Helper to get player name for a lane
  function getPlayerNameForLane(laneKey, laneIdx) {
    if (!teamPlayers || !teamPlayers.players) return PLAYER.name;
    // Try to match by role (case-insensitive, substring)
    const found = teamPlayers.players.find(
      p => p.role && p.role.toLowerCase().includes(laneKey)
    );
    if (found && found.name) return found.name;
    // Fallback: use the player at the same index
    if (teamPlayers.players[laneIdx] && teamPlayers.players[laneIdx].name) {
      return teamPlayers.players[laneIdx].name;
    }
    return PLAYER.name;
  }

  // Helper to get hero for a lane by lane key
  function getHeroForLaneByLaneKey(laneKey, lanePlayers) {
    if (!lanePlayers) return null;
    // lanePlayers is now an array of { lane, hero }
    const found = Array.isArray(lanePlayers)
      ? lanePlayers.find(p => p && p.lane && p.lane.toLowerCase() === laneKey)
      : null;
    return found ? found.hero : null;
  }

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
      {/* Header */}
      <header
        className="flex items-center pl-0 pr-8 py-0"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${navbarBg}) center/cover, #23232a`,
          borderBottom: '1px solid #23283a',
          height: '80px'
        }}
      >
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
          onClick={() => navigate('/')}
        />
        <div className="flex-1 flex items-center">
          <nav className="flex space-x-8 ml-4">
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/home')}>Data Draft</button>
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/mock-draft')}>Mock Draft</button>
            <button className="text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold">Players Statistic</button>
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/team-history')}>Team History</button>
          </nav>
        </div>
      </header>
      {/* Main Content */}
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center mt-12 space-y-4">
          {/* Top row */}
          <div className="flex flex-row justify-center gap-x-8 w-full">
            <PlayerCard lane={LANES[0]} player={{...PLAYER, name: getPlayerNameForLane('exp', 0)}} hero={getHeroForLaneByLaneKey('exp', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[0], player: {...PLAYER, name: getPlayerNameForLane('exp', 0)}, hero: getHeroForLaneByLaneKey('exp', lanePlayers) })} />
            <PlayerCard lane={LANES[1]} player={{...PLAYER, name: getPlayerNameForLane('mid', 1)}} hero={getHeroForLaneByLaneKey('mid', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[1], player: {...PLAYER, name: getPlayerNameForLane('mid', 1)}, hero: getHeroForLaneByLaneKey('mid', lanePlayers) })} />
          </div>
          {/* Middle row */}
          <div className="flex flex-row justify-center w-full">
            <PlayerCard lane={LANES[2]} player={{...PLAYER, name: getPlayerNameForLane('jungler', 2)}} hero={getHeroForLaneByLaneKey('jungler', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[2], player: {...PLAYER, name: getPlayerNameForLane('jungler', 2)}, hero: getHeroForLaneByLaneKey('jungler', lanePlayers) })} />
          </div>
          {/* Bottom row */}
          <div className="flex flex-row justify-center gap-x-8 w-full">
            <PlayerCard lane={LANES[3]} player={{...PLAYER, name: getPlayerNameForLane('gold', 3)}} hero={getHeroForLaneByLaneKey('gold', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[3], player: {...PLAYER, name: getPlayerNameForLane('gold', 3)}, hero: getHeroForLaneByLaneKey('gold', lanePlayers) })} />
            <PlayerCard lane={LANES[4]} player={{...PLAYER, name: getPlayerNameForLane('roam', 4)}} hero={getHeroForLaneByLaneKey('roam', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[4], player: {...PLAYER, name: getPlayerNameForLane('roam', 4)}, hero: getHeroForLaneByLaneKey('roam', lanePlayers) })} />
          </div>
        </div>
        {/* Modal */}
        {modalInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-[#23232a] rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-[90vw] relative flex flex-col items-center">
              <button className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold" onClick={() => setModalInfo(null)}>&times;</button>
              <div className="mb-4 flex flex-col items-center">
                <img src={modalInfo.player.photo} alt="Player" className="w-[180px] h-[210px] object-cover mb-2 rounded-xl" />
                <img src={modalInfo.player.teamLogo} alt="Team Logo" className="w-16 h-16 object-contain mb-2" style={{ opacity: 0.4 }} />
                <div className="text-white text-xl font-bold mb-1">{modalInfo.player.name}</div>
                <div className="flex items-center gap-2 mb-2">
                  <img src={modalInfo.lane.icon} alt={modalInfo.lane.label} className="w-8 h-8 object-contain" />
                  <span className="text-yellow-300 text-base font-extrabold tracking-widest">{modalInfo.lane.label}</span>
                </div>
                {modalInfo.hero && (
                  <div className="text-blue-300 text-lg font-semibold">Hero: {modalInfo.hero}</div>
                )}
              </div>
              {/* Placeholder for more info */}
              <div className="text-gray-300 text-center mt-2">More player/lane/hero details can go here.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerCard({ lane, player, hero, highlight, onClick }) {
  return (
    <button
      type="button"
      className={`relative flex items-center bg-[#111216] shadow-lg transition-all duration-200 overflow-hidden w-[520px] h-[150px] p-0 cursor-pointer focus:outline-none`}
      style={{ borderRadius: 0, minWidth: 0, border: 'none' }}
      onClick={onClick}
    >
      {/* Player image and team logo layered */}
      <div className="relative flex-shrink-0 z-20" style={{ width: 210, height: 230, marginLeft: -30 }}>
        {/* Team logo behind player image */}
        <img
          src={player.teamLogo}
          alt="Team Logo BG"
          className="absolute left-[70%] top-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
          style={{
            width: 220,
            height: 220,
            opacity: 0.3,
            zIndex: 1,
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 16px #0008)'
          }}
        />
        {/* Player photo above logo, PNG with transparency, no border or background */}
        <img
          src={player.photo}
          alt="Player"
          className="relative w-[210px] h-[230px] object-contain z-10"
          style={{ background: 'none', border: 'none', boxShadow: 'none' }}
        />
      </div>
      {/* Player info */}
      <div className="flex-1 ml-8 min-w-0 flex flex-col justify-center z-30">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-white text-[1.35rem] font-bold tracking-wide truncate leading-tight">{player.name}</div>
          <div className="flex flex-col items-end ml-4 min-w-[90px] mr-8">
            <img src={lane.icon} alt={lane.label} className="w-8 h-8 object-contain mb-1" />
            <span className="text-yellow-300 text-xs font-extrabold tracking-widest">{lane.label}</span>
          </div>
        </div>
        {hero && (
          <div className="mt-2 text-blue-300 text-sm font-semibold">Hero: {hero}</div>
        )}
      </div>
    </button>
  );
} 