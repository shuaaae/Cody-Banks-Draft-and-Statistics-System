import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mobaImg from '../assets/moba1.png';
import mainBg from '../assets/mainbg.jpg';
import PageTitle from '../components/PageTitle';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showTeamPickerModal, setShowTeamPickerModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [isDeletingTeam, setIsDeletingTeam] = useState(false);
  const [teams, setTeams] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamLogoFile, setTeamLogoFile] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [activeTeam, setActiveTeam] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      setTeamLogo(URL.createObjectURL(file));
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

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuthToken');
    setIsLoggedIn(false);
    setActiveTeam(null);
    localStorage.removeItem('latestTeam');
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setShowPassword(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      console.log('Attempting login with:', { email: loginEmail });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Login-Type': 'user'
        },
        body: JSON.stringify({ 
          email: loginEmail, 
          password: loginPassword 
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        console.log('Response not ok, status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        // Show user-friendly error message
        if (response.status === 401) {
          throw new Error('Invalid Credentials');
        } else {
          throw new Error('Login failed. Please try again.');
        }
      }

      const data = await response.json();
      console.log('Logged in user:', data.user);
      
      // Store user info in localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Clear any existing admin session to prevent conflicts
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminAuthToken');
      
      // Update login state
      setIsLoggedIn(true);
      
      // Close modal and clear form
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      
      console.log('Login successful, staying on landing page');
      
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setLoginError('');
      }, 3000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Update login state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = localStorage.getItem('currentUser');
      setIsLoggedIn(!!currentUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Test API connection (only log errors)
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch('/api/test');
        if (!response.ok) {
          console.error('API connection failed:', response.status);
        }
      } catch (error) {
        console.error('API connection error:', error);
      }
    };

    testApiConnection();
  }, []);



  // Load active team and fetch teams from API
  useEffect(() => {
    const loadActiveTeam = async () => {
      try {
        const response = await fetch('/api/teams/active');
        if (response.ok) {
          const activeTeamData = await response.json();
          setActiveTeam(activeTeamData);
        } else if (response.status === 404) {
          // 404 is expected when no active team exists
          console.log('No active team found (expected)');
          localStorage.removeItem('latestTeam');
          setActiveTeam(null);
        } else {
          console.log('Unexpected error loading active team:', response.status);
          localStorage.removeItem('latestTeam');
          setActiveTeam(null);
        }
      } catch (error) {
        console.error('Network error loading active team:', error);
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
      navigate('/home', { 
        state: { 
          selectedTeam: activeTeam.teamName,
          activeTeamData: activeTeam 
        } 
      });
    } else {
      setShowTeamPickerModal(true);
    }
  };

  const handleSwitchOrAddTeam = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    
    if (teams.length === 0) {
      setShowAddTeamModal(true);
    } else {
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
        
        const prevTeam = localStorage.getItem('latestTeam');
        if (prevTeam) {
          const history = JSON.parse(localStorage.getItem('teamsHistory')) || [];
          history.push(JSON.parse(prevTeam));
          localStorage.setItem('teamsHistory', JSON.stringify(history));
        }
        
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
        
        const teamData = {
          teamName,
          players,
          id: newTeam.id
        };
        localStorage.setItem('latestTeam', JSON.stringify(teamData));
        
        localStorage.removeItem('latestMatch');
        sessionStorage.clear();
        
        navigate('/home', { 
          state: { 
            selectedTeam: teamName,
            activeTeamData: teamData,
            isNewTeam: true
          } 
        });
        
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

  // Delete team functions
  const handleDeleteTeam = (team) => {
    setTeamToDelete(team);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!teamToDelete) return;
    
    setIsDeletingTeam(true);
    try {
      const response = await fetch(`/api/teams/${teamToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the team from the local state
        setTeams(teams.filter(team => team.id !== teamToDelete.id));
        
        // If this was the active team, clear it
        if (activeTeam && activeTeam.id === teamToDelete.id) {
          setActiveTeam(null);
        }
        
        // Close the modal
        setShowDeleteConfirmModal(false);
        setTeamToDelete(null);
      } else {
        console.error('Failed to delete team:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting team:', error);
    } finally {
      setIsDeletingTeam(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setTeamToDelete(null);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${mainBg}) center/cover, #181A20` }}>
      <PageTitle title="" />
      {/* Top Navbar */}
      <header
        style={{
          width: '100%',
          height: 80,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}
      >
                {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <img
            src={mobaImg}
            alt="Logo"
            style={{
              height: 128,
              width: 128,
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />
        </div>

        {/* Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}>
          <button
          style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = '#FFD600'}
            onMouseLeave={(e) => e.target.style.color = '#fff'}
          >
            About Us
          </button>
          {isLoggedIn ? (
            <>
              <span style={{
                color: '#10b981',
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}>
                Welcome, {JSON.parse(localStorage.getItem('currentUser'))?.name || 'User'}
              </span>
              <button
                style={{
                  color: '#ef4444',
                  fontSize: 16,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = '#FFD600'}
              onMouseLeave={(e) => e.target.style.color = '#fff'}
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingLeft: 48,
        paddingRight: 48,
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: 800,
          width: '100%',
        }}>
          {/* Hero Headline */}
          <h1 style={{
            color: '#fff',
            fontSize: '3.5rem',
            fontWeight: 800,
            marginBottom: 24,
            letterSpacing: 1,
            lineHeight: 1.2,
            textShadow: '0 4px 24px rgba(0,0,0,0.8)',
            textTransform: 'uppercase',
          }}>
            Create Your Team Now and Plan Your Strategy
          </h1>
          
                    {/* Subtext */}
          <p style={{
            color: '#f3f4f6',
            fontSize: '1.25rem',
            marginBottom: 48,
            fontWeight: 500,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}>
            The ultimate draft and statistics platform for esports teams.<br />
            Track, analyze, and strategize your matches with a game-inspired experience.
          </p>
          
          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <button
              style={{
                background: hoveredBtn === 'switchteam' ? 'transparent' : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                color: hoveredBtn === 'switchteam' ? '#3b82f6' : '#fff',
                fontWeight: 800,
                fontSize: '1.125rem',
                padding: '16px 32px',
                borderRadius: 12,
                border: `2px solid ${hoveredBtn === 'switchteam' ? '#3b82f6' : 'transparent'}`,
                boxShadow: '0 4px 24px rgba(59, 130, 246, 0.3)',
                cursor: 'pointer',
                letterSpacing: 1,
                textTransform: 'uppercase',
                transition: 'all 0.25s ease',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                minWidth: 200,
              }}
              onClick={handleSwitchOrAddTeam}
              onMouseEnter={() => setHoveredBtn('switchteam')}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              {isLoggedIn ? 'Switch Team' : 'Login to Switch Team'}
            </button>

          <button
            style={{
                background: hoveredBtn === 'addteam' ? 'transparent' : 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                color: hoveredBtn === 'addteam' ? '#10b981' : '#fff',
              fontWeight: 800,
                fontSize: '1.125rem',
                padding: '16px 32px',
              borderRadius: 12,
                border: `2px solid ${hoveredBtn === 'addteam' ? '#10b981' : 'transparent'}`,
                boxShadow: '0 4px 24px rgba(16, 185, 129, 0.3)',
              cursor: 'pointer',
              letterSpacing: 1,
              textTransform: 'uppercase',
                transition: 'all 0.25s ease',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                minWidth: 200,
            }}
              onClick={() => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                } else {
                  setShowAddTeamModal(true);
                }
              }}
              onMouseEnter={() => setHoveredBtn('addteam')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
              {isLoggedIn ? 'Add New Team' : 'Login to Add Team'}
          </button>
          </div>
        </div>
      </main>

      {/* Add Team Modal */}
      {showAddTeamModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
          onClick={() => setShowAddTeamModal(false)}
        >
          <div 
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-600 shadow-2xl w-[95vw] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>
            
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 z-50 cursor-pointer hover:scale-110 bg-gray-800/50 rounded-full w-8 h-8 flex items-center justify-center" 
              onClick={() => setShowAddTeamModal(false)}
              type="button"
            >
              ✕
            </button>
            
            {/* Header Section */}
            <div className="relative z-10 text-center p-6">
              <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Create Your Team
              </h2>
              <p className="text-gray-300 text-sm">Build your esports squad and dominate the competition</p>
            </div>
            
            {/* Logo Upload Section */}
            <div className="relative z-10 mb-4 flex flex-col items-center">
              <label htmlFor="team-logo-upload" className="cursor-pointer group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-gray-600 relative overflow-hidden shadow-xl group-hover:border-blue-400 transition-all duration-300 group-hover:scale-105">
                  {teamLogo ? (
                    <img src={teamLogo} alt="Team Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-blue-400 text-4xl font-bold mb-1">+</span>
                      <span className="text-gray-400 text-xs">Upload Logo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <input id="team-logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </div>
              </label>
            </div>
            
            {/* Team Name Input */}
            <div className="relative z-10 w-full flex justify-center mb-4 px-6">
              <input
                type="text"
                className="w-full max-w-md bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl py-3 px-6 text-white text-center font-semibold text-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 transition-all duration-200"
                placeholder="Enter Team Name"
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
              />
            </div>
            
            {/* Players Section */}
            <div className="relative z-10 w-full flex-1 overflow-y-auto px-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-1">Add Your Players</h3>
                <p className="text-gray-400 text-xs">Assign roles to each team member</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {players.map((player, idx) => (
                  <div key={idx} className="relative group">
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-600 rounded-xl p-3 hover:border-blue-400/50 transition-all duration-200">
                      <input
                        type="text"
                        className="w-full bg-gray-700/80 border border-gray-500 rounded-lg py-2 px-3 text-white text-center font-medium mb-2 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 transition-all duration-200 text-sm"
                        placeholder="Player Name"
                        value={player.name}
                        onChange={e => handlePlayerChange(idx, e.target.value)}
                      />
                      <select
                        className="w-full bg-gray-700/80 border border-gray-500 rounded-lg py-2 px-3 text-gray-200 text-center text-xs outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                        value={player.role}
                        onChange={e => handleRoleChange(idx, e.target.value)}
                      >
                        <option value="">Select Lane</option>
                        {laneRoles.map(lane => (
                          <option key={lane.key} value={lane.key}>{lane.label}</option>
                        ))}
                      </select>
                      
                      {idx >= defaultRoles.length && (
                        <button
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110"
                          onClick={() => handleRemovePlayer(idx)}
                          title="Remove player"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add More Player Button */}
              <div className="mb-4">
                <button
                  className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 border border-gray-500 rounded-xl py-3 px-4 text-white font-semibold text-sm flex items-center justify-center transition-all duration-200 hover:scale-105"
                  onClick={handleAddPlayer}
                >
                  <span className="mr-2">Add More Player</span>
                  <span className="text-blue-400 text-lg font-bold">+</span>
                </button>
              </div>
            </div>
            
            {/* Confirm Button */}
            <div className="relative z-10 w-full p-6 border-t border-gray-700">
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 transform"
                onClick={handleConfirm}
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Picker Modal */}
      {showTeamPickerModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
          onClick={() => setShowTeamPickerModal(false)}
        >
          <div 
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-600 shadow-2xl w-[95vw] max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>
            
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 z-50 cursor-pointer hover:scale-110 bg-gray-800/50 rounded-full w-8 h-8 flex items-center justify-center" 
              onClick={() => setShowTeamPickerModal(false)}
              type="button"
            >
              ✕
            </button>
            
            {/* Header Section */}
            <div className="relative z-10 text-center p-6">
              <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Select Your Team
              </h2>
              <p className="text-gray-300 text-sm">Choose an existing team or create a new one</p>
            </div>

            {/* Teams List */}
            <div className="relative z-10 flex-1 overflow-y-auto px-6">
              {loadingTeams ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="text-white ml-3">Loading teams...</span>
                </div>
              ) : teams.length > 0 ? (
                <div className="space-y-3">
                  {teams.map((team) => {
                    const isActive = activeTeam && activeTeam.id === team.id;
                    // Use created_at as fallback since last_used_at is not provided by API
                    const lastUsed = team.last_used_at ? new Date(team.last_used_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : team.created_at ? new Date(team.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'Never used';
                    
                    return (
                      <div 
                        key={team.id} 
                        className={`rounded-2xl p-4 border transition-all duration-200 hover:scale-105 ${
                          isActive 
                            ? 'bg-gradient-to-r from-green-600/20 to-green-500/20 border-green-400 shadow-lg shadow-green-500/20' 
                            : 'bg-gray-800/60 backdrop-blur-sm border-gray-600 hover:border-blue-400/50 hover:bg-gray-700/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {team.logo_path ? (
                              <img 
                                src={team.logo_path} 
                                alt={`${team.name} logo`} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-600 ${team.logo_path ? 'hidden' : 'flex'}`}
                            >
                              {team.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-white font-semibold text-lg">{team.name}</h3>
                                {isActive && (
                                  <span className="text-green-400 text-sm font-medium bg-green-500/20 px-2 py-1 rounded-full">🟢 Active</span>
                                )}
                              </div>
                              <p className="text-gray-300 text-sm">
                                {team.players_data?.length || 0} players • Last used {lastUsed}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSelectTeam(team.id)}
                              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                                isActive 
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg'
                              }`}
                            >
                              {isActive ? 'Continue' : 'Select'}
                            </button>
                            <button
                              onClick={() => handleDeleteTeam(team)}
                              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-105 shadow-lg"
                              title="Delete team"
                            >
                              🗑️
                            </button>
                          </div>
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
              
              {teams.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-600">
                  <button
                    onClick={() => {
                      setShowTeamPickerModal(false);
                      setShowAddTeamModal(true);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:scale-[1.01] shadow-lg flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">➕</span>
                    Add New Team
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Spacing */}
            <div className="relative z-10 w-full p-6">
            </div>


          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
          onClick={handleCloseLoginModal}
        >
          <div 
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-600 shadow-2xl w-[95vw] max-w-md flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>
            
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 z-50 cursor-pointer hover:scale-110 bg-gray-800/50 rounded-full w-8 h-8 flex items-center justify-center" 
              onClick={handleCloseLoginModal}
              type="button"
            >
              ✕
            </button>
            
            {/* Header Section */}
            <div className="relative z-10 text-center p-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Welcome Back Coach!
              </h2>
              <p className="text-gray-300 text-sm">Sign in to access your esports dashboard</p>
            </div>
            
            {/* Login Form */}
            <div className="relative z-10 px-8 pb-8">
              <form className="space-y-6" onSubmit={handleLogin}>
                {/* Email Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                
                {/* Password Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl py-4 px-6 pr-12 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Error Display */}
                {loginError && (
                  <div className="bg-red-900/20 border border-red-600 rounded-lg p-3">
                    <div className="text-red-400 text-sm">{loginError}</div>
                  </div>
                )}
                
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-400 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
                
                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </button>
                

                

              </form>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
          onClick={() => setShowSignupModal(false)}
        >
          <div 
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-600 shadow-2xl w-[95vw] max-w-md max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50"></div>
            
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 z-50 cursor-pointer hover:scale-110 bg-gray-800/50 rounded-full w-8 h-8 flex items-center justify-center" 
              onClick={() => setShowSignupModal(false)}
              type="button"
            >
              ✕
            </button>
            
            {/* Header Section */}
            <div className="relative z-10 text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-xl">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Join the Competition
              </h2>
              <p className="text-gray-300 text-sm">Create your account and start your esports journey</p>
            </div>
            
            {/* Signup Form */}
            <div className="relative z-10 px-8 pb-8 flex-1 overflow-y-auto">
              <form className="space-y-4">
                {/* Full Name Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                {/* Password Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    placeholder="Create a password"
                    required
                  />
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                
                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-400 focus:ring-2 mt-1"
                    required
                  />
                  <label className="ml-2 text-sm text-gray-300">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      Terms of Service
                    </button>
                    {' '}and{' '}
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>
                
                {/* Sign Up Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] transform"
                >
                  Create Account
                </button>
                
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">Or sign up with</span>
                  </div>
                </div>
                
                {/* Google Signup Button */}
                <div className="w-full">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-800/50 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </button>
                </div>
                
                {/* Sign In Link */}
                <div className="text-center">
                  <span className="text-gray-400 text-sm">Already have an account? </span>
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                    onClick={() => {
                      setShowSignupModal(false);
                      setShowLoginModal(true);
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4"
          onClick={handleCancelDelete}
        >
          <div 
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-gray-600 shadow-2xl w-[95vw] max-w-md flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-500/5 opacity-50"></div>
            
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl font-bold transition-colors duration-200 z-50 cursor-pointer hover:scale-110 bg-gray-800/50 rounded-full w-8 h-8 flex items-center justify-center" 
              onClick={handleCancelDelete}
              type="button"
            >
              ✕
            </button>
            
            {/* Header Section */}
            <div className="relative z-10 text-center p-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl">
                <span className="text-3xl">🗑️</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-red-400 to-red-400 bg-clip-text text-transparent">
                Delete Team
              </h2>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete <strong className="text-white">{teamToDelete?.name}</strong>?
              </p>
              <p className="text-red-400 text-sm mt-2">
                This action cannot be undone.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="relative z-10 px-8 pb-8">
              <div className="flex space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                  disabled={isDeletingTeam}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeletingTeam}
                >
                  {isDeletingTeam ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete Team'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          header {
            padding: 0 24px !important;
          }
          
          h1 {
            font-size: 2rem !important;
            padding: 0 16px !important;
          }
          
          p {
            font-size: 1rem !important;
            padding: 0 16px !important;
          }
          
          main {
            padding: 80px 24px 24px !important;
          }
          
          .button-container {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
} 