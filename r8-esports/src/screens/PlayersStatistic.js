import React, { useEffect, useState, useRef } from 'react';
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

// PlayerCard must be placed BEFORE PlayersStatistic
const PlayerCard = ({ lane, player, hero, highlight, onClick }) => {
  return (
    <button
      type="button"
      className="relative flex items-center bg-[#111216] shadow-lg transition-all duration-200 overflow-hidden w-[520px] h-[150px] p-0 cursor-pointer focus:outline-none"
      style={{ borderRadius: 0, minWidth: 0, border: 'none' }}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0 z-20" style={{ width: 210, height: 230, marginLeft: -30 }}>
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
        <img
          src={player.photo ? player.photo : defaultPlayer}
          alt="Player"
          className="relative w-[210px] h-[230px] object-contain z-10"
          style={{ background: 'none', border: 'none', boxShadow: 'none' }}
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
        {hero && (
          <div className="mt-2 text-blue-300 text-sm font-semibold">Hero: {hero}</div>
        )}
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
  const [playerPhotos, setPlayerPhotos] = useState({});
  const fileInputRef = useRef();
  const [uploadingPlayer, setUploadingPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

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

  function getCurrentTeamName() {
    return teamPlayers && teamPlayers.teamName ? teamPlayers.teamName : 'Unknown Team';
  }

  async function handlePhotoUpload(e, playerName) {
    const file = e.target.files[0];
    if (!file || !playerName) return;
    setUploadingPlayer(playerName);
    const formData = new FormData();
    formData.append('photo', file);
    const playerId = 1;
    try {
      const response = await fetch(`/api/players/${playerId}/photo`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setPlayerPhotos(prev => ({ ...prev, [playerName]: data.photo }));
      } else {
        alert('Failed to upload photo');
      }
    } catch (err) {
      alert('Error uploading photo');
    }
    setUploadingPlayer(null);
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
    const formData = new FormData();
    formData.append('photo', pendingPhoto.file);
    try {
      const response = await fetch(`/api/players/${pendingPhoto.playerId}/photo`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        // Update players array with new photo URL
        setPlayers(prev => prev.map(p =>
          p.id === pendingPhoto.playerId ? { ...p, photo: data.photo } : p
        ));
        setPlayerPhotos(prev => ({ ...prev, [pendingPhoto.playerName]: data.photo }));
        // Update teamPlayers (if present) so the card and modal use the new photo
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
          <div className="bg-[#23232a] rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-[90vw] relative flex flex-col items-center">
            <button className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold" onClick={() => setModalInfo(null)}>&times;</button>
            <div className="mb-4 flex flex-col items-center">
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
                className="w-[180px] h-[210px] object-cover mb-2 rounded-xl cursor-pointer"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                title="Click to upload new photo"
                style={{ opacity: uploadingPlayer === modalInfo.player.name ? 0.5 : 1 }}
              />
              {uploadingPlayer === modalInfo.player.name && <div className="text-blue-300 mb-2">Uploading...</div>}
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
            <div className="text-gray-300 text-center mt-2">More player/lane/hero details can go here.</div>
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
