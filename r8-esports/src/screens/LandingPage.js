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
        }
      `}</style>
    </div>
  );
} 