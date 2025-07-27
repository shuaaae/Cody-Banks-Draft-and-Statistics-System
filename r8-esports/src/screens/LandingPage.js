import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredBtn, setHoveredBtn] = useState(null); // 'getstarted' or 'addteam' or null
  const buttonWidth = 220;
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showTeamPickerModal, setShowTeamPickerModal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamLogoFile, setTeamLogoFile] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [previousTeam, setPreviousTeam] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);
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
      const file = e.target.files[0];
      // Create a preview URL for the UI
      setTeamLogo(URL.createObjectURL(file));
      // Store the file for upload
      setTeamLogoFile(file);
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

  // Load active team and fetch teams from API
  useEffect(() => {
    const loadActiveTeam = async () => {
      try {
        // First try to get active team from API
        const response = await fetch('/api/teams/active');
        if (response.ok) {
          const activeTeamData = await response.json();
          setActiveTeam(activeTeamData);
        } else {
          // If no active team in backend, clear localStorage and don't set any team
          console.log('No active team in backend, clearing localStorage');
          localStorage.removeItem('latestTeam');
          setActiveTeam(null);
        }
      } catch (error) {
        console.error('Error loading active team:', error);
        // If API fails, clear localStorage and don't set any team
        console.log('API error, clearing localStorage');
        localStorage.removeItem('latestTeam');
        setActiveTeam(null);
      }
    };

    const fetchTeams = async () => {
      setLoadingTeams(true);
      try {
        const response = await fetch('/api/teams');
        if (response.ok) {
          const teamsData = await response.json();
          setTeams(teamsData);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoadingTeams(false);
      }
    };

    loadActiveTeam();
    fetchTeams();
  }, []);

  const handleContinueWithCurrentTeam = () => {
    if (activeTeam) {
      // Navigate to home page with the active team pre-selected
      navigate('/home', { 
        state: { 
          selectedTeam: activeTeam.teamName,
          activeTeamData: activeTeam 
        } 
      });
    } else {
      // If no active team, show team picker
      setShowTeamPickerModal(true);
    }
  };

  const handleSwitchOrAddTeam = () => {
    // If no teams exist, directly open team creation modal
    if (teams.length === 0) {
      setShowAddTeamModal(true);
    } else {
      // If teams exist, open team picker modal
      setShowTeamPickerModal(true);
    }
  };

  const handleSelectTeam = async (teamId) => {
    try {
      const response = await fetch('/api/teams/set-active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_id: teamId }),
      });

      if (response.ok) {
        // Store the selected team in localStorage for the frontend
        const selectedTeam = teams.find(team => team.id === teamId);
        const teamData = {
          teamName: selectedTeam.name,
          players: selectedTeam.players_data || [],
          id: selectedTeam.id
        };
        
        localStorage.setItem('latestTeam', JSON.stringify(teamData));
        setActiveTeam(teamData);
        
        setShowTeamPickerModal(false);
        navigate('/home', { 
          state: { 
            selectedTeam: selectedTeam.name,
            activeTeamData: teamData 
          } 
        });
      }
    } catch (error) {
      console.error('Error setting active team:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      let logoPath = null;
      
      // Upload logo file if exists
      if (teamLogoFile) {
        console.log('Uploading logo file:', teamLogoFile.name);
        const formData = new FormData();
        formData.append('logo', teamLogoFile);
        
        const uploadResponse = await fetch('/api/teams/upload-logo', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          logoPath = uploadResult.logo_path;
          console.log('Logo uploaded successfully:', logoPath);
        } else {
          console.error('Failed to upload logo:', await uploadResponse.text());
        }
      } else {
        console.log('No logo file to upload');
      }
      
      // Save team to database
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: teamName,
          players: players,
          logo_path: logoPath
        }),
      });

      if (response.ok) {
        const newTeam = await response.json();
        
        // Save current latestTeam to teamsHistory (history)
        const prevTeam = localStorage.getItem('latestTeam');
        if (prevTeam) {
          const history = JSON.parse(localStorage.getItem('teamsHistory')) || [];
          history.push(JSON.parse(prevTeam));
          localStorage.setItem('teamsHistory', JSON.stringify(history));
        }
        
        // Set the new team as active in the backend session
        try {
          const setActiveResponse = await fetch('/api/teams/set-active', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ team_id: newTeam.id }),
          });
          
          if (setActiveResponse.ok) {
            console.log('New team set as active:', newTeam.name);
          }
        } catch (error) {
          console.error('Error setting new team as active:', error);
        }
        
        // Save new team as latestTeam
        const teamData = {
          teamName,
          players,
          id: newTeam.id
        };
        localStorage.setItem('latestTeam', JSON.stringify(teamData));
        
        // Clear ALL data for new team to ensure complete isolation
        localStorage.removeItem('latestMatch');
        sessionStorage.clear();
        
        // Redirect to HomePage.js with team data and force fresh start
        navigate('/home', { 
          state: { 
            selectedTeam: teamName,
            activeTeamData: teamData,
            isNewTeam: true // Flag to indicate this is a new team
          } 
        });
        
        // Reset modal state
        setShowAddTeamModal(false);
        setTeamLogo(null);
        setTeamLogoFile(null);
        setTeamName("");
        setPlayers([
          { role: "exp", name: "" },
          { role: "mid", name: "" },
          { role: "jungler", name: "" },
          { role: "gold", name: "" },
          { role: "roam", name: "" },
        ]);
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
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
          
          {/* Welcome Message */}
          <div style={{
            color: '#f3f4f6',
            fontSize: 18,
            marginBottom: 24,
            fontWeight: 600,
            textShadow: '0 2px 12px #000a',
          }}>
            👋 Welcome back, Coach!
          </div>
          
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
          
          {/* Active Team Section */}
          {activeTeam && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                border: '2px solid rgba(34, 197, 94, 0.3)',
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(34, 197, 94, 0.2)',
              }}
              onClick={handleContinueWithCurrentTeam}
              onMouseEnter={() => setHoveredBtn('activeteam')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)',
                }}>
                  <span style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>🟢</span>
                </div>
                <div>
                  <h3 style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 700,
                    margin: 0,
                    textShadow: '0 2px 8px #0008',
                  }}>
                    Continue with {activeTeam.teamName}
                  </h3>
                  <p style={{
                    color: '#bbf7d0',
                    fontSize: 13,
                    margin: 0,
                    fontWeight: 500,
                  }}>
                    🟢 Active • {activeTeam.players?.length || 0} players • Click to continue
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                }}>
                  {activeTeam.players?.slice(0, 3).map((player, index) => (
                    <span key={index} style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#86efac',
                      fontSize: 11,
                      padding: '4px 8px',
                      borderRadius: 8,
                      fontWeight: 600,
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}>
                      {player.name}
                    </span>
                  ))}
                  {activeTeam.players?.length > 3 && (
                    <span style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#86efac',
                      fontSize: 11,
                      padding: '4px 8px',
                      borderRadius: 8,
                      fontWeight: 600,
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}>
                      +{activeTeam.players.length - 3} more
                    </span>
                  )}
                </div>
                <div style={{
                  color: hoveredBtn === 'activeteam' ? '#22c55e' : '#10b981',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'color 0.3s ease',
                }}>
                  {hoveredBtn === 'activeteam' ? '→ Continue' : '→'}
                </div>
              </div>
            </div>
          )}
          <button
            style={{
              width: '280px',
              background: hoveredBtn === 'switchteam' ? 'transparent' : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
              color: hoveredBtn === 'switchteam' ? '#3b82f6' : '#fff',
              fontWeight: 800,
              fontSize: 18,
              padding: '10px 36px',
              borderRadius: 12,
              border: '2px solid ' + (hoveredBtn === 'switchteam' ? '#3b82f6' : 'transparent'),
              boxShadow: '0 4px 24px 0 #3b82f644',
              cursor: 'pointer',
              letterSpacing: 1,
              textTransform: 'uppercase',
              transition: 'background 0.25s, color 0.25s, border 0.25s',
              textShadow: '0 2px 8px #0008',
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
            onClick={handleSwitchOrAddTeam}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseOver={() => setHoveredBtn('switchteam')}
          >
            {teams.length === 0 ? '👉 Add Your Team Now' : '🔄 Switch or Add New Team'}
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

      {/* Team Picker Modal */}
      {showTeamPickerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-gradient-to-b from-gray-700 to-gray-800 rounded-2xl border-2 border-blue-400 shadow-2xl w-[95vw] max-w-2xl p-8 flex flex-col">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl font-bold" 
              onClick={() => setShowTeamPickerModal(false)}
            >
              &times;
            </button>
            
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-white text-2xl font-bold mb-2">🔽 Select Your Team</h2>
              <p className="text-gray-300">Choose an existing team or create a new one</p>
            </div>

            {/* Teams List */}
            <div className="flex-1 overflow-y-auto max-h-96">
              {loadingTeams ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="text-white ml-3">Loading teams...</span>
                </div>
              ) : teams.length > 0 ? (
                <div className="space-y-3">
                  {teams.map((team) => {
                    const isActive = activeTeam && activeTeam.id === team.id;
                    const lastUsed = team.last_used_at ? new Date(team.last_used_at).toLocaleDateString() : 'Never used';
                    
                    return (
                      <div 
                        key={team.id} 
                        className={`rounded-xl p-4 border transition-colors ${
                          isActive 
                            ? 'bg-green-600 bg-opacity-20 border-green-400' 
                            : 'bg-gray-600 bg-opacity-40 border-gray-500 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {team.logo_path ? (
                              <img 
                                src={team.logo_path} 
                                alt={`${team.name} logo`} 
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ${team.logo_path ? 'hidden' : 'flex'}`}
                            >
                              {team.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-white font-semibold text-lg">{team.name}</h3>
                                {isActive && (
                                  <span className="text-green-400 text-sm font-medium">🟢 Active</span>
                                )}
                              </div>
                              <p className="text-gray-300 text-sm">
                                {team.players_data?.length || 0} players • Last used {lastUsed}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSelectTeam(team.id)}
                            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                              isActive 
                                ? 'bg-green-500 hover:bg-green-600 text-white' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            {isActive ? 'Continue' : 'Select'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-300 mb-4">No teams found. Please create a new one.</p>
                  <button
                    onClick={() => {
                      setShowTeamPickerModal(false);
                      setShowAddTeamModal(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Create New Team
                  </button>
                </div>
              )}
              
              {/* Add New Team Button - Always show when teams exist */}
              {teams.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <button
                    onClick={() => {
                      setShowTeamPickerModal(false);
                      setShowAddTeamModal(true);
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>➕</span>
                    Add New Team
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-600 flex justify-end">
              <button
                onClick={() => setShowTeamPickerModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
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