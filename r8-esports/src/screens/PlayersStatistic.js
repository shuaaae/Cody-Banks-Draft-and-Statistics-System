import React, { useEffect, useState, useRef, useCallback } from 'react';
<<<<<<< HEAD
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import defaultPlayer from '../assets/default.png'; import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip } from 'chart.js';
import PageTitle from '../components/PageTitle';
import Header from '../components/Header';
import ProfileModal from '../components/ProfileModal';
import useSessionTimeout from '../hooks/useSessionTimeout';
import {
  PlayerCard,
  TeamDisplayCard,
  PlayerModal,
  PerformanceModal,
  ConfirmUploadModal,
  PlayerGrid,
  LANES,
  PLAYER,
  scrollbarHideStyles
} from '../components/PlayersStatistic';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip);

function PlayersStatistic() {
=======
import mobaImg from '../assets/moba1.png';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import defaultPlayer from '../assets/default.png';
import teamLogo from '../assets/teamlogo.jpg';
import expIcon from '../assets/exp.jpg';
import midIcon from '../assets/mid.jpg';
import junglerIcon from '../assets/jungle.jpg';
import goldIcon from '../assets/gold.jpg';
import roamIcon from '../assets/roam.jpg';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip } from 'chart.js';
import { FaHome, FaDraftingCompass, FaUserFriends, FaUsers, FaChartBar } from 'react-icons/fa';
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
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
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
<<<<<<< HEAD
  const [allPlayerStats, setAllPlayerStats] = useState({}); // cache for all player stats
  const [allPlayerH2HStats, setAllPlayerH2HStats] = useState({}); // cache for all player H2H stats
  const [heroH2HStats, setHeroH2HStats] = useState([]); // current modal H2H stats
  const [isLoadingStats, setIsLoadingStats] = useState(false); // loading state for stats
  const [showPerformanceModal, setShowPerformanceModal] = useState(false); // performance modal state
  const [imageCache, setImageCache] = useState({}); // cache for player images
  const [currentTeamId, setCurrentTeamId] = useState(null); // track current team ID
  const statsFetchingRef = useRef(false);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true); // Add loading state for team
  // User avatar state
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false); // Add profile modal state
  
  // User session timeout: 30 minutes
  useSessionTimeout(30, 'currentUser', '/');

  // Check if user is logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuthToken');
    navigate('/');
  };

  // Hero evaluation state
  const [heroEvaluation, setHeroEvaluation] = useState(() => {
    const currentPlayerName = modalInfo?.player?.name || '';
    const saved = localStorage.getItem(`heroEvaluation_${currentPlayerName}`);
    return saved ? JSON.parse(saved) : {
      date: '',
      blackHeroes: Array(15).fill(''),
      blueHeroes: Array(15).fill(''),
      redHeroes: Array(15).fill(''),
      commitment: '',
      goal: '',
      roleMeaning: ''
    };
  });
  
  // Player evaluation state
  const [playerEvaluation, setPlayerEvaluation] = useState(() => {
    const currentPlayerName = modalInfo?.player?.name || '';
    const saved = localStorage.getItem(`playerEvaluation_${currentPlayerName}`);
    return saved ? JSON.parse(saved) : {
      date: '',
      name: '',
      role: '',
      notes: '',
      qualities: {
        'In-Game knowledge': null,
        'Reflex': null,
        'Skills': null,
        'Communications': null,
        'Technical Skill': null,
        'Attitude': null,
        'Decision Making': null,
        'Hero Pool': null,
        'Skillshots': null,
        'Team Material': null
      },
      comments: Array(10).fill('')
    };
  });

  // Preload and cache player images
  const preloadPlayerImages = useCallback(async (teamPlayers) => {
    if (!teamPlayers) return;
    
    const playersArray = teamPlayers.players_data || teamPlayers.players;
    if (!playersArray) return;
    
    const newImageCache = { ...imageCache };
    const imagePromises = playersArray.map(async (player) => {
      if (!player.name) return;
      
      const playerIdentifier = getPlayerIdentifier(player.name, player.role);
      
      try {
        // Check if image is already cached
        if (newImageCache[playerIdentifier]) return;
        
        // Try to fetch player photo from server
        const response = await fetch(`/api/players/photo-by-name?playerName=${encodeURIComponent(player.name)}`, {
          method: 'GET',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.photo_path) {
            // Preload the image
            const img = new Image();
            img.onload = () => {
              setImageCache(prev => ({
                ...prev,
                [playerIdentifier]: data.photo_path
              }));
            };
            img.onerror = () => {
              console.error(`Failed to load image for ${player.name}:`, data.photo_path);
            };
            img.src = data.photo_path;
          }
        }
      } catch (error) {
        console.log(`No photo found for ${player.name}, using default`);
      }
    });
    
    await Promise.all(imagePromises);
  }, [imageCache]);

  // Load team players and preload images
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

    const loadTeamData = async () => {
      setIsLoadingTeam(true);
      
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setIsLoadingTeam(false);
      }, 5000); // 5 second timeout
      
      try {
        // First try to get team data from localStorage for immediate display
        const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
        
        if (latestTeam && latestTeam.teamName) {
          // Set team data immediately from localStorage for fast display
          setTeamPlayers(latestTeam);
          setCurrentTeamId(latestTeam.id);
          
          // Then fetch fresh data from backend in background
          try {
            const response = await fetch(`/api/teams/active`);
            if (response.ok) {
              const activeTeam = await response.json();
              
              // Update localStorage with fresh data
              const updatedTeamData = {
                teamName: activeTeam.name,
                players_data: activeTeam.players_data || activeTeam.players || [],
                id: activeTeam.id
              };
              
              localStorage.setItem('latestTeam', JSON.stringify(updatedTeamData));
              setTeamPlayers(updatedTeamData);
              setCurrentTeamId(activeTeam.id);
              
              // Preload player images for the team
              preloadPlayerImages(updatedTeamData);
            }
          } catch (error) {
            console.error('Error fetching fresh team data:', error);
            // Keep using localStorage data if API fails
          }
        } else {
          // Try to fetch active team from API
          try {
            const response = await fetch(`/api/teams/active`);
            if (response.ok) {
              const activeTeam = await response.json();
              const teamData = {
                teamName: activeTeam.name,
                players_data: activeTeam.players_data || activeTeam.players || [],
                id: activeTeam.id
              };
              localStorage.setItem('latestTeam', JSON.stringify(teamData));
              setTeamPlayers(teamData);
              setCurrentTeamId(activeTeam.id);
              preloadPlayerImages(teamData);
            } else {
              setTeamPlayers(null);
            }
          } catch (error) {
            console.error('Error fetching active team:', error);
            setTeamPlayers(null);
          }
        }
      } catch (error) {
        console.error('Error loading team data:', error);
        // Fallback to localStorage data
        const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
        setTeamPlayers(latestTeam || null);
      } finally {
        clearTimeout(timeoutId);
        setIsLoadingTeam(false);
      }
    };

    loadTeamData();
  }, [currentTeamId]); // Re-run when team changes

  // Listen for team changes and page visibility changes
  useEffect(() => {
    const checkTeamChange = () => {
      const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
      if (latestTeam && latestTeam.id !== currentTeamId) {
        console.log('Team change detected:', currentTeamId, '->', latestTeam.id);
        setCurrentTeamId(latestTeam.id);
        setTeamPlayers(latestTeam);
        preloadPlayerImages(latestTeam);
      }
    };

    // Check when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkTeamChange();
      }
    };

    // Check periodically for team changes (reduced frequency)
    const interval = setInterval(checkTeamChange, 5000); // Changed from 2000 to 5000ms

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentTeamId]);

  // Get cached player photo or default
  const getPlayerPhoto = useCallback((playerName, playerRole) => {
    const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
    
    // First check memory cache with the full identifier
    if (imageCache[playerIdentifier]) {
      return imageCache[playerIdentifier];
    }
    
    // If not found and we have a role, try to find by name only (for players with null roles in DB)
    if (playerRole && !imageCache[playerIdentifier]) {
      const nameOnlyIdentifier = playerName;
      if (imageCache[nameOnlyIdentifier]) {
        return imageCache[nameOnlyIdentifier];
      }
    }
    
    // Check localStorage for cached photo
    const cachedPhoto = localStorage.getItem(`playerPhoto_${playerIdentifier}`);
    if (cachedPhoto) {
      return cachedPhoto;
    }
    
    // If not found and we have a role, try to find by name only in localStorage
    if (playerRole) {
      const nameOnlyCachedPhoto = localStorage.getItem(`playerPhoto_${playerName}`);
      if (nameOnlyCachedPhoto) {
        return nameOnlyCachedPhoto;
      }
    }
    
    // Check if player exists in players array and has a photo
    // First try to find by name and role
    let player = players.find(p => p.name === playerName && p.role === playerRole);
    
    // If not found and role is null, try to find by name only
    if (!player && (playerRole === null || playerRole === undefined)) {
      player = players.find(p => p.name === playerName);
    }
    
    if (player && player.photo) {
      return player.photo;
    }
    
    return defaultPlayer;
  }, [imageCache, players]);
=======
  const [allPlayerStats, setAllPlayerStats] = useState({}); // NEW: cache for all player stats
  const [heroH2HStats, setHeroH2HStats] = useState([]); // NEW: H2H stats
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
<<<<<<< HEAD
      .then(data => {
        setPlayers(data);
        
        // Cache any existing player photos
        const newImageCache = { ...imageCache };
        data.forEach(player => {
          if (player.name && player.photo) {
            // Cache by name only for players with null role
            const cacheKey = player.role ? `${player.name}_${player.role}` : player.name;
            newImageCache[cacheKey] = player.photo;
            localStorage.setItem(`playerPhoto_${cacheKey}`, player.photo);
          }
        });
        setImageCache(newImageCache);
      });
  }, [imageCache]);

  // Pre-fetch all player stats and H2H stats for the current team
  useEffect(() => {
    const playersArray = teamPlayers?.players_data || teamPlayers?.players;
    if (teamPlayers && playersArray && teamPlayers.teamName) {
      // Prevent multiple simultaneous fetches
      if (isLoadingStats || statsFetchingRef.current) return;
      
      statsFetchingRef.current = true;
      setIsLoadingStats(true);
      
      const fetchAllStats = async () => {
        try {
          console.log('Fetching stats for team:', teamPlayers.teamName);
          const statsObj = {};
          const h2hStatsObj = {};
          
          await Promise.all(
            playersArray.map(async (p) => {
              if (!p.name || !p.role) return;
              
              const playerIdentifier = getPlayerIdentifier(p.name, p.role);
              
              // Fetch both regular stats and H2H stats in parallel
              const [statsRes, h2hRes] = await Promise.all([
                fetch(`/api/players/${encodeURIComponent(p.name)}/hero-stats-by-team?teamName=${encodeURIComponent(teamPlayers.teamName)}&role=${encodeURIComponent(p.role)}`),
                fetch(`/api/players/${encodeURIComponent(p.name)}/hero-h2h-stats-by-team?teamName=${encodeURIComponent(teamPlayers.teamName)}&role=${encodeURIComponent(p.role)}`)
              ]);
              
              const statsData = await statsRes.json();
              const h2hData = await h2hRes.json();
              
              statsObj[playerIdentifier] = statsData;
              h2hStatsObj[playerIdentifier] = h2hData;
            })
          );
          
          setAllPlayerStats(statsObj);
          setAllPlayerH2HStats(h2hStatsObj);
          console.log('Stats fetched successfully');
        } catch (error) {
          console.error('Error fetching player stats:', error);
        } finally {
          setIsLoadingStats(false);
          statsFetchingRef.current = false;
        }
      };
      fetchAllStats();
    }
  }, [teamPlayers?.id, teamPlayers?.teamName]); // Only depend on team ID and name, not the entire object
=======
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
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5

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
<<<<<<< HEAD
  }, [isLoadingStats]);

  const getCurrentTeamName = useCallback(() => {
    if (isLoadingTeam) {
      return 'Loading Team...';
    }
    return teamPlayers && teamPlayers.teamName ? teamPlayers.teamName : 'Unknown Team';
  }, [teamPlayers, isLoadingTeam]);

  // Use cached stats for modal - instant display
  useEffect(() => {
    if (modalInfo && modalInfo.player && modalInfo.player.name) {
      const playerIdentifier = modalInfo.player.identifier || getPlayerIdentifier(modalInfo.player.name, modalInfo.player.role);
      const cached = allPlayerStats[playerIdentifier];
      const cachedH2H = allPlayerH2HStats[playerIdentifier];
      
      // Set loading state when modal opens and clear previous stats
      setIsLoadingStats(true);
      setHeroStats([]);
      setHeroH2HStats([]);
      
      // Set stats immediately from cache if available
      if (cached) {
        setHeroStats(cached);
      }
      if (cachedH2H) {
        setHeroH2HStats(cachedH2H);
      }
      
      // If both are cached, we can hide loading immediately
      if (cached && cachedH2H) {
        setIsLoadingStats(false);
      }
      
      // Load player evaluation data for this specific player
      const savedPlayerEvaluation = localStorage.getItem(`playerEvaluation_${playerIdentifier}`);
      if (savedPlayerEvaluation) {
        setPlayerEvaluation(JSON.parse(savedPlayerEvaluation));
      } else {
        // Reset to default state for new player
        setPlayerEvaluation({
          date: '',
          name: '',
          role: '',
          notes: '',
          qualities: {
            'In-Game knowledge': null,
            'Reflex': null,
            'Skills': null,
            'Communications': null,
            'Technical Skill': null,
            'Attitude': null,
            'Decision Making': null,
            'Hero Pool': null,
            'Skillshots': null,
            'Team Material': null
          },
          comments: Array(10).fill('')
        });
      }
      
      // Load hero evaluation data for this specific player
      const savedHeroEvaluation = localStorage.getItem(`heroEvaluation_${playerIdentifier}`);
      if (savedHeroEvaluation) {
        setHeroEvaluation(JSON.parse(savedHeroEvaluation));
      } else {
        // Reset to default state for new player
        setHeroEvaluation({
          date: '',
          blackHeroes: Array(15).fill(''),
          blueHeroes: Array(15).fill(''),
          redHeroes: Array(15).fill(''),
          commitment: '',
          goal: '',
          roleMeaning: ''
        });
      }
      
      // If not cached, fetch (fallback)
      if (!cached || !cachedH2H) {
        const teamName = getCurrentTeamName();
        const role = modalInfo.player.role;
        
        const fetchPromises = [];
        
        if (!cached) {
          fetchPromises.push(
            fetch(`/api/players/${encodeURIComponent(modalInfo.player.name)}/hero-stats-by-team?teamName=${encodeURIComponent(teamName)}&role=${encodeURIComponent(role)}`)
              .then(res => res.json())
              .then(data => setHeroStats(data))
          );
        }
        
        if (!cachedH2H) {
          fetchPromises.push(
            fetch(`/api/players/${encodeURIComponent(modalInfo.player.name)}/hero-h2h-stats-by-team?teamName=${encodeURIComponent(teamName)}&role=${encodeURIComponent(role)}`)
              .then(res => res.json())
              .then(data => setHeroH2HStats(data))
          );
        }
        
        // Wait for all fetches to complete before hiding loading
        Promise.all(fetchPromises)
          .then(() => {
            setIsLoadingStats(false);
          })
          .catch((error) => {
            console.error('Error fetching player stats:', error);
            setIsLoadingStats(false);
          });
      } else {
        // If all data is cached, hide loading immediately since both tables will show
        setIsLoadingStats(false);
      }
    } else {
      setHeroStats([]);
      setHeroH2HStats([]);
      setIsLoadingStats(false);
    }
  }, [modalInfo, allPlayerStats, allPlayerH2HStats, getCurrentTeamName]);

  // Utility functions
  function getPlayerNameForLane(laneKey, laneIdx) {
    // Show loading state while team is being loaded
    if (isLoadingTeam) {
      return 'Loading...';
    }
    
    // Remove excessive logging to prevent infinite loops
    if (!teamPlayers) {
      return `Player ${laneIdx + 1}`;
    }
    
    // Check for both players_data and players properties
    const playersArray = teamPlayers.players_data || teamPlayers.players;
    
    if (!playersArray || !Array.isArray(playersArray)) {
      return `Player ${laneIdx + 1}`;
    }
    
    // For 6 players, use index-based assignment for proper role mapping
    if (playersArray.length === 6) {
      // Map players by index: 0=exp, 1=mid, 2=jungler, 3=gold, 4=roam, 5=substitute
      const indexMapping = {
        0: 'exp',    // 1st player = exp
        1: 'mid',    // 2nd player = mid
        2: 'jungler', // 3rd player = jungler
        3: 'gold',   // 4th player = gold
        4: 'roam',   // 5th player = roam
        5: 'sub'     // 6th player = substitute
      };
      
      // Check if the requested lane matches the index mapping
      if (indexMapping[laneIdx] === laneKey) {
        if (playersArray[laneIdx] && playersArray[laneIdx].name) {
          return playersArray[laneIdx].name;
        }
      }
      
      // If no match found, return the player at that index anyway
      if (playersArray[laneIdx] && playersArray[laneIdx].name) {
        return playersArray[laneIdx].name;
      }
      
      return `Player ${laneIdx + 1}`;
    }
    
    // For 5 or fewer players, use the original role-based logic
    // First try exact role match
    let found = playersArray.find(
      p => p.role && p.role.toLowerCase() === laneKey.toLowerCase()
    );
    
    // If no exact match, try partial match
    if (!found) {
      found = playersArray.find(
        p => p.role && p.role.toLowerCase().includes(laneKey.toLowerCase())
      );
    }
    
    // If still no match, try common role variations
    if (!found) {
      const roleVariations = {
        'exp': ['exp', 'explainer', 'explane', 'exp lane'],
        'mid': ['mid', 'midlaner', 'mid lane'],
        'jungler': ['jungler', 'jungle', 'jungle lane'],
        'gold': ['gold', 'goldlaner', 'gold lane', 'marksman'],
        'roam': ['roam', 'roamer', 'roam lane', 'support']
      };
      
      const variations = roleVariations[laneKey] || [laneKey];
      found = playersArray.find(
        p => p.role && variations.some(variation => 
          p.role.toLowerCase().includes(variation.toLowerCase())
        )
      );
    }
    
    if (found && found.name) {
      return found.name;
    }
    
    // Fallback to index-based lookup
    if (playersArray[laneIdx] && playersArray[laneIdx].name) {
      return playersArray[laneIdx].name;
    }
    
    return `Player ${laneIdx + 1}`;
  }

  // Create unique player identifier using name and role
  function getPlayerIdentifier(playerName, role) {
    return role ? `${playerName}_${role}` : playerName;
  }

  // Get player role by lane key
  function getRoleByLaneKey(laneKey) {
    const roleMap = {
      'exp': 'exp',
      'mid': 'mid', 
      'jungler': 'jungler',
      'gold': 'gold',
      'roam': 'roam',
      'sub': 'substitute'
    };
    return roleMap[laneKey] || laneKey;
=======

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
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
  }

  function getHeroForLaneByLaneKey(laneKey, lanePlayers) {
    if (!lanePlayers) return null;
    const found = Array.isArray(lanePlayers)
      ? lanePlayers.find(p => p && p.lane && p.lane.toLowerCase() === laneKey)
      : null;
    return found ? found.hero : null;
  }

<<<<<<< HEAD
  // Event handlers
  function handleFileSelect(e, playerName, playerRole) {
    const file = e.target.files[0];
    if (!file || !playerName) return;
    const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
    setPendingPhoto({ file, playerName, playerRole, playerIdentifier });
=======
  function handleFileSelect(e, playerName) {
    const file = e.target.files[0];
    if (!file || !playerName) return;
    const player = players.find(p => p.name === playerName);
    const playerId = player ? player.id : 1;
    setPendingPhoto({ file, playerName, playerId });
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
    setShowConfirmModal(true);
  }

  async function handleConfirmUpload() {
    if (!pendingPhoto) return;
    setUploadingPlayer(pendingPhoto.playerName);
    try {
      const formData = new FormData();
      formData.append('photo', pendingPhoto.file);
      formData.append('playerName', pendingPhoto.playerName);
<<<<<<< HEAD
      formData.append('playerRole', pendingPhoto.playerRole);
=======
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
      const response = await fetch(`/api/players/photo-by-name`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
<<<<<<< HEAD
        
        // Cache the uploaded image using unique identifier
        if (data.photo_path) {
          setImageCache(prev => ({
            ...prev,
            [pendingPhoto.playerIdentifier]: data.photo_path
          }));
          // Also cache in localStorage for persistence
          localStorage.setItem(`playerPhoto_${pendingPhoto.playerIdentifier}`, data.photo_path);
        }
        
        setPlayers(prev => {
          // Find player by name and role, or by name only if role is null
          let idx = prev.findIndex(p => 
            p.name === pendingPhoto.playerName && p.role === pendingPhoto.playerRole
          );
          
          if (idx === -1 && (pendingPhoto.playerRole === null || pendingPhoto.playerRole === undefined)) {
            idx = prev.findIndex(p => p.name === pendingPhoto.playerName);
          }
          
          if (idx !== -1) {
            // Update existing player
            return prev.map(p =>
              (p.name === pendingPhoto.playerName && 
               (pendingPhoto.playerRole === null ? p.role === null : p.role === pendingPhoto.playerRole)) 
                ? { ...p, photo: data.photo_path } 
                : p
            );
          } else {
            // Add new player
            return [...prev, { ...data.player, photo: data.photo_path }];
          }
        });
                 setTeamPlayers(prev => {
           if (!prev) return prev;
           const playersArray = prev.players_data || prev.players;
           if (!playersArray) return prev;
           
           const updatedPlayers = playersArray.map(p =>
             (p.name === pendingPhoto.playerName && 
              (pendingPhoto.playerRole === null ? p.role === null : p.role === pendingPhoto.playerRole)) 
               ? { ...p, photo: data.photo_path } 
               : p
           );
           
           return {
             ...prev,
             players_data: updatedPlayers,
             players: updatedPlayers
           };
         });
=======
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
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
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
<<<<<<< HEAD
  
  // Hero evaluation functions
  function handleHeroEvaluationChange(field, index, value) {
    setHeroEvaluation(prev => {
      const updated = {
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      };
      const playerIdentifier = modalInfo?.player?.identifier || getPlayerIdentifier(modalInfo?.player?.name || '', modalInfo?.player?.role || '');
      localStorage.setItem(`heroEvaluation_${playerIdentifier}`, JSON.stringify(updated));
      return updated;
    });
  }
  
  function handleHeroEvaluationTextChange(field, value) {
    setHeroEvaluation(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      const playerIdentifier = modalInfo?.player?.identifier || getPlayerIdentifier(modalInfo?.player?.name || '', modalInfo?.player?.role || '');
      localStorage.setItem(`heroEvaluation_${playerIdentifier}`, JSON.stringify(updated));
      return updated;
    });
  }
  
  // Player evaluation functions
  function handlePlayerEvaluationChange(field, value) {
    setPlayerEvaluation(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      const playerIdentifier = modalInfo?.player?.identifier || getPlayerIdentifier(modalInfo?.player?.name || '', modalInfo?.player?.role || '');
      localStorage.setItem(`playerEvaluation_${playerIdentifier}`, JSON.stringify(updated));
      return updated;
    });
  }
  
  function handleQualityRating(quality, rating) {
    setPlayerEvaluation(prev => {
      const updated = {
        ...prev,
        qualities: {
          ...prev.qualities,
          [quality]: prev.qualities[quality] === rating ? null : rating
        }
      };
      const playerIdentifier = modalInfo?.player?.identifier || getPlayerIdentifier(modalInfo?.player?.name || '', modalInfo?.player?.role || '');
      localStorage.setItem(`playerEvaluation_${playerIdentifier}`, JSON.stringify(updated));
      return updated;
    });
  }
  
  function handleCommentChange(index, value) {
    setPlayerEvaluation(prev => {
      const updated = {
        ...prev,
        comments: prev.comments.map((comment, i) => i === index ? value : comment)
      };
      const playerIdentifier = modalInfo?.player?.identifier || getPlayerIdentifier(modalInfo?.player?.name || '', modalInfo?.player?.role || '');
      localStorage.setItem(`playerEvaluation_${playerIdentifier}`, JSON.stringify(updated));
      return updated;
    });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
      <PageTitle title="Players Statistic" />
      <style>{scrollbarHideStyles}</style>
      
      {/* Header Component */}
      <Header 
        currentUser={currentUser}
        onLogout={handleLogout}
        onShowProfile={() => setShowProfileModal(true)}
      />

            {/* Main Content */}
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center flex-1" style={{ marginTop: -130 }}>
        {/* Team Display Card */}
        <TeamDisplayCard teamName={getCurrentTeamName()} />
        
        {/* Loading Spinner */}
        {isLoadingTeam && (
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-white text-lg">Loading team data...</p>
          </div>
        )}
        
        {/* Player Grid */}
        {!isLoadingTeam && (
          <PlayerGrid
            teamPlayers={teamPlayers}
            players={players}
            lanePlayers={lanePlayers}
            LANES={LANES}
            PLAYER={PLAYER}
            getPlayerNameForLane={getPlayerNameForLane}
            getRoleByLaneKey={getRoleByLaneKey}
            getHeroForLaneByLaneKey={getHeroForLaneByLaneKey}
            getPlayerIdentifier={getPlayerIdentifier}
            getPlayerPhoto={getPlayerPhoto}
            onPlayerClick={setModalInfo}
          />
        )}
      </div>

      {/* Player Modal */}
      <PlayerModal
        modalInfo={modalInfo}
        onClose={() => setModalInfo(null)}
        getPlayerPhoto={getPlayerPhoto}
        heroStats={heroStats}
        heroH2HStats={heroH2HStats}
        isLoadingStats={isLoadingStats}
        onFileSelect={() => fileInputRef.current && fileInputRef.current.click()}
        uploadingPlayer={uploadingPlayer}
        onViewPerformance={() => setShowPerformanceModal(true)}
      />

      {/* Performance Modal */}
      <PerformanceModal
        isOpen={showPerformanceModal}
        onClose={() => setShowPerformanceModal(false)}
        modalInfo={modalInfo}
        heroStats={heroStats}
        heroEvaluation={heroEvaluation}
        playerEvaluation={playerEvaluation}
        onHeroEvaluationChange={handleHeroEvaluationChange}
        onHeroEvaluationTextChange={handleHeroEvaluationTextChange}
        onPlayerEvaluationChange={handlePlayerEvaluationChange}
        onQualityRating={handleQualityRating}
        onCommentChange={handleCommentChange}
      />

      {/* Confirm Upload Modal */}
      <ConfirmUploadModal
        isOpen={showConfirmModal}
        pendingPhoto={pendingPhoto}
        onConfirm={handleConfirmUpload}
        onCancel={handleCancelUpload}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={currentUser}
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={e => handleFileSelect(e, modalInfo?.player?.name, modalInfo?.player?.role)}
      />
    </div>
  );
}

export default PlayersStatistic;
=======

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
          background: 'transparent',
          boxShadow: 'none',
        }}
      >
        {/* Logo */}
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
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center flex-1" style={{ marginTop: 80 }}>
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
>>>>>>> 785b5dd1122d4e69303c857a251ae193f4f72eb5
