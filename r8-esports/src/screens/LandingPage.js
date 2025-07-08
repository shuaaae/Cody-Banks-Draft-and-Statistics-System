import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredBtn, setHoveredBtn] = useState(null); // 'getstarted' or 'addteam' or null
  const buttonWidth = 220;
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamName, setTeamName] = useState("");
  const laneRoles = [
    { key: 'exp', label: 'Exp Lane' },
    { key: 'mid', label: 'Mid Lane' },
    { key: 'jungler', label: 'Jungler' },
    { key: 'gold', label: 'Gold Lane' },
    { key: 'roam', label: 'Roam' },
  ];
  const [players, setPlayers] = useState([
    { role: "exp", name: "" },
    { role: "mid", name: "" },
    { role: "jungler", name: "" },
    { role: "gold", name: "" },
    { role: "roam", name: "" },
  ]);

  const defaultRoles = ["exp", "mid", "jungler", "gold", "roam"];

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setTeamLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePlayerChange = (idx, value) => {
    setPlayers(players.map((p, i) => i === idx ? { ...p, name: value } : p));
  };

  const handleAddPlayer = () => {
    setPlayers([...players, { role: "", name: "" }]);
  };

  const handleRoleChange = (idx, value) => {
    setPlayers(players.map((p, i) => i === idx ? { ...p, role: value } : p));
  };

  const handleRemovePlayer = (idx) => {
    setPlayers(players.filter((_, i) => i !== idx));
  };

  const handleConfirm = () => {
    // Save current latestTeam to teamsHistory (history)
    const prevTeam = localStorage.getItem('latestTeam');
    if (prevTeam) {
      const history = JSON.parse(localStorage.getItem('teamsHistory')) || [];
      history.push(JSON.parse(prevTeam));
      localStorage.setItem('teamsHistory', JSON.stringify(history));
    }
    // Save new team as latestTeam
    localStorage.setItem('latestTeam', JSON.stringify({
      teamName,
      players
    }));
    // Clear draft data for new team
    localStorage.removeItem('latestMatch');
    // Redirect to HomePage.js
    navigate('/home');
    // Reset modal state
    setShowAddTeamModal(false);
    setTeamLogo(null);
    setTeamName("");
    setPlayers([
      { role: "exp", name: "" },
      { role: "mid", name: "" },
      { role: "jungler", name: "" },
      { role: "gold", name: "" },
      { role: "roam", name: "" },
    ]);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#181A20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1100,
          minHeight: 480,
          aspectRatio: '16/7',
          borderRadius: 32,
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(30,40,80,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {/* Background image anchored right */}
        <img
          src={require('../assets/coach1.jpg')}
          alt="Coach Hero"
          style={{
            position: 'absolute',
            top: 0,
            left: '40%',
            width: '60%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7) blur(1.2px) saturate(1.1)',
            zIndex: 1,
            transition: 'left 0.3s',
          }}
        />
        {/* Overlay gradient for readability, stronger on left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(24,26,32,0.98) 0%, rgba(24,26,32,0.85) 30%, rgba(24,26,32,0.2) 65%, rgba(24,26,32,0.0) 100%)',
            zIndex: 2,
          }}
        />
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: 56,
            paddingRight: 32,
            width: '48%',
            minWidth: 220,
          }}
        >
          <h1
            style={{
              color: '#fff',
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 18,
              letterSpacing: 0.5,
              lineHeight: 1.15,
              textShadow: '0 4px 24px #000a',
            }}
          >
            Cody Banks Draft<br /> and Statistics System
          </h1>
          <p
            style={{
              color: '#f3f4f6',
              fontSize: 16,
              marginBottom: 32,
              fontWeight: 500,
              textShadow: '0 2px 12px #000a',
              maxWidth: 380,
              lineHeight: 1.5,
            }}
          >
            The ultimate draft and statistics platform for esports teams. Track, analyze, and strategize your matches with a game-inspired experience.
          </p>
          <button
            style={{
              width: buttonWidth,
              background: hoveredBtn === 'getstarted' ? 'transparent' : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
              color: hoveredBtn === 'getstarted' ? '#3b82f6' : '#fff',
              fontWeight: 800,
              fontSize: 18,
              padding: '14px 36px',
              borderRadius: 12,
              border: '2px solid ' + (hoveredBtn === 'getstarted' ? '#3b82f6' : 'transparent'),
              boxShadow: '0 4px 24px 0 #3b82f644',
              cursor: 'pointer',
              letterSpacing: 1,
              textTransform: 'uppercase',
              transition: 'background 0.25s, color 0.25s, border 0.25s',
              textShadow: '0 2px 8px #0008',
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
            onClick={() => navigate('/home')}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseOver={() => setHoveredBtn('getstarted')}
          >
            Get Started
          </button>
          <button
            style={{
              width: buttonWidth,
              background: hoveredBtn === 'addteam' ? 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' : 'transparent',
              color: hoveredBtn === 'addteam' ? '#fff' : '#3b82f6',
              fontWeight: 700,
              fontSize: 17,
              padding: '12px 32px',
              borderRadius: 10,
              border: '2px solid ' + (hoveredBtn === 'addteam' ? 'transparent' : '#3b82f6'),
              cursor: 'pointer',
              letterSpacing: 1,
              textTransform: 'uppercase',
              transition: 'background 0.25s, color 0.25s, border 0.25s',
              marginBottom: 4,
              boxSizing: 'border-box',
            }}
            onClick={() => setShowAddTeamModal(true)}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseOver={() => setHoveredBtn('addteam')}
          >
            + Add Team
          </button>
        </div>
      </div>
      {showAddTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-gradient-to-b from-gray-700 to-gray-800 rounded-2xl border-2 border-blue-400 shadow-2xl w-[95vw] max-w-xl p-8 flex flex-col items-center">
            {/* Close button */}
            <button className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold" onClick={() => setShowAddTeamModal(false)}>&times;</button>
            {/* Logo upload */}
            <div className="-mt-24 mb-4 flex flex-col items-center">
              <label htmlFor="team-logo-upload" className="cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-blue-200 relative overflow-hidden shadow-lg">
                  {teamLogo ? (
                    <img src={teamLogo} alt="Team Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-blue-400 text-5xl font-bold">+</span>
                  )}
                  <input id="team-logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </div>
              </label>
              <span className="text-xs text-gray-400 mt-1">Upload Team Logo</span>
            </div>
            {/* Team Name */}
            <input
              type="text"
              className="w-full max-w-md bg-gray-500 bg-opacity-60 rounded-xl py-3 px-6 text-white text-center font-semibold text-lg mb-6 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
              placeholder="Team Name"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
            />
            <div className="text-white font-bold text-lg mb-4 text-center">Add Your Player Below</div>
            <div className="w-full grid grid-cols-2 gap-4 mb-4">
              {players.map((player, idx) => (
                <div key={idx} className="flex flex-col items-center relative">
                  <input
                    type="text"
                    className="w-full bg-gray-500 bg-opacity-60 rounded-full py-2 px-4 text-white text-center font-medium mb-1 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-300"
                    placeholder="Player Name"
                    value={player.name}
                    onChange={e => handlePlayerChange(idx, e.target.value)}
                  />
                  <select
                    className="w-full bg-gray-600 bg-opacity-40 rounded-full py-1 px-3 text-gray-200 text-center text-xs outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 mb-1"
                    value={player.role}
                    onChange={e => handleRoleChange(idx, e.target.value)}
                  >
                    <option value="">Select Lane</option>
                    {laneRoles.map(lane => (
                      <option key={lane.key} value={lane.key}>{lane.label}</option>
                    ))}
                  </select>
                  {/* X button for removing extra players */}
                  {idx >= defaultRoles.length && (
                    <button
                      className="absolute top-1 right-2 text-gray-300 hover:text-red-400 text-lg font-bold focus:outline-none"
                      onClick={() => handleRemovePlayer(idx)}
                      title="Remove player"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              className="w-full max-w-xs bg-gray-500 bg-opacity-60 rounded-xl py-3 px-6 text-white font-semibold text-base flex items-center justify-center mb-6 hover:bg-blue-500 hover:bg-opacity-80 transition"
              onClick={handleAddPlayer}
            >
              <span className="mr-2">Add more player</span>
              <span className="text-blue-300 text-xl font-bold">+</span>
            </button>
            <button
              className="w-full max-w-xs bg-blue-500 rounded-xl py-3 px-6 text-white font-bold text-lg shadow-lg hover:bg-blue-600 transition"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      {/* Responsive: stack vertically on small screens */}
      <style>{`
        @media (max-width: 900px) {
          div[style*='aspect-ratio'] {
            aspect-ratio: unset !important;
            min-height: 340px !important;
            flex-direction: column !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          div[style*='paddingLeft: 56px'] {
            padding-left: 18px !important;
            padding-right: 18px !important;
            width: 100% !important;
          }
          h1 { font-size: 1.3rem !important; }
        }
      `}</style>
    </div>
  );
} 