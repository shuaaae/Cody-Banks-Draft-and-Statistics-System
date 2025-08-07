<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mainBg from '../assets/mainbg.jpg';
import PageTitle from '../components/PageTitle';
import {
  Header,
  HeroSection,
  AddTeamModal,
  TeamPickerModal,
  LoginModal,
  SignupModal,
  DeleteConfirmModal
} from '../components/LandingPage';

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
=======
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredBtn, setHoveredBtn] = useState(null); // 'getstarted' or 'addteam' or null
  const buttonWidth = 220;
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [teamLogo, setTeamLogo] = useState(null);
  const [teamName, setTeamName] = useState("");
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
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
<<<<<<< HEAD
      const file = e.target.files[0];
      setTeamLogo(URL.createObjectURL(file));
      setTeamLogoFile(file);
=======
      setTeamLogo(URL.createObjectURL(e.target.files[0]));
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
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

<<<<<<< HEAD
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

  const handleAddTeam = () => {
                if (!isLoggedIn) {
                  setShowLoginModal(true);
                } else {
                  setShowAddTeamModal(true);
                }
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const onAddNewTeam = () => {
                      setShowTeamPickerModal(false);
                      setShowAddTeamModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${mainBg}) center/cover, #181A20` }}>
      <PageTitle title="" />
      
      <Header 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
      />

      <HeroSection 
        isLoggedIn={isLoggedIn}
        hoveredBtn={hoveredBtn}
        setHoveredBtn={setHoveredBtn}
        onSwitchOrAddTeam={handleSwitchOrAddTeam}
        onAddTeam={handleAddTeam}
      />

      <AddTeamModal
        showAddTeamModal={showAddTeamModal}
        setShowAddTeamModal={setShowAddTeamModal}
        teamLogo={teamLogo}
        teamName={teamName}
        setTeamName={setTeamName}
        players={players}
        laneRoles={laneRoles}
        defaultRoles={defaultRoles}
        handleLogoChange={handleLogoChange}
        handlePlayerChange={handlePlayerChange}
        handleAddPlayer={handleAddPlayer}
        handleRoleChange={handleRoleChange}
        handleRemovePlayer={handleRemovePlayer}
        handleConfirm={handleConfirm}
      />

      <TeamPickerModal
        showTeamPickerModal={showTeamPickerModal}
        setShowTeamPickerModal={setShowTeamPickerModal}
        loadingTeams={loadingTeams}
        teams={teams}
        activeTeam={activeTeam}
        handleSelectTeam={handleSelectTeam}
        handleDeleteTeam={handleDeleteTeam}
        onAddNewTeam={onAddNewTeam}
      />

      <LoginModal
        showLoginModal={showLoginModal}
        handleCloseLoginModal={handleCloseLoginModal}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginError={loginError}
        isLoggingIn={isLoggingIn}
        showPassword={showPassword}
        togglePasswordVisibility={togglePasswordVisibility}
        handleLogin={handleLogin}
      />

      <SignupModal
        showSignupModal={showSignupModal}
        setShowSignupModal={setShowSignupModal}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <DeleteConfirmModal
        showDeleteConfirmModal={showDeleteConfirmModal}
        teamToDelete={teamToDelete}
        isDeletingTeam={isDeletingTeam}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
      />

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
=======
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
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
        }
      `}</style>
    </div>
  );
} 