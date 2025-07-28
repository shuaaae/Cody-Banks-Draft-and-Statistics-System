import React, { useEffect, useState, useRef, useCallback } from 'react';
import mobaImg from '../assets/moba1.png';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import defaultPlayer from '../assets/default.png';
import expIcon from '../assets/exp.png';
import midIcon from '../assets/mid.png';
import junglerIcon from '../assets/jungle.png';
import goldIcon from '../assets/gold.png';
import roamIcon from '../assets/roam.png';
import expBg from '../assets/expbg.jpg';
import midBg from '../assets/midbg.jpg';
import roamBg from '../assets/roambg.jpg';
import goldBg from '../assets/goldbg.jpg';
import jungleBg from '../assets/junglebg.jpg';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip } from 'chart.js';
import { FaUsers, FaChartLine } from 'react-icons/fa';
import { FaHome, FaDraftingCompass, FaUserFriends, FaChartBar } from 'react-icons/fa';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip);

// Custom CSS for hiding scrollbars
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Safari and Chrome */
  }
`;

// PlayerCard must be placed BEFORE PlayersStatistic
const PlayerCard = ({ lane, player, hero, highlight, onClick, getPlayerPhoto }) => {
  const playerPhoto = getPlayerPhoto ? getPlayerPhoto(player.name) : (player.photo ? player.photo : defaultPlayer);
  

  
  return (
    <button
      type="button"
      className="group relative flex items-center shadow-lg transition-all duration-300 overflow-hidden w-[520px] h-[150px] p-0 cursor-pointer focus:outline-none hover:shadow-2xl hover:scale-105 hover:border-l-4 hover:border-blue-500"
      style={{ 
        borderRadius: '12px 12px 12px 0px', 
        minWidth: 0, 
        border: 'none',
        background: (lane.key === 'exp' || lane.key === 'mid' || lane.key === 'roam' || lane.key === 'gold' || lane.key === 'jungler') ? 'transparent' : '#111216'
      }}
      onMouseEnter={(e) => {
        if (lane.key === 'exp') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="exp"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${expBg}) center/cover`;
          }
        } else if (lane.key === 'mid') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="mid"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${midBg}) center/cover`;
          }
        } else if (lane.key === 'roam') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="roam"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${roamBg}) center/cover`;
          }
        } else if (lane.key === 'gold') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="gold"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${goldBg}) center/cover`;
          }
        } else if (lane.key === 'jungler') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="jungler"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${jungleBg}) center/cover`;
          }
        } else {
          e.target.style.background = '#1a1d2a';
        }
      }}
      onMouseLeave={(e) => {
        if (lane.key === 'exp') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="exp"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${expBg}) center/cover`;
          }
        } else if (lane.key === 'mid') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="mid"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${midBg}) center/cover`;
          }
        } else if (lane.key === 'roam') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="roam"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${roamBg}) center/cover`;
          }
        } else if (lane.key === 'gold') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="gold"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${goldBg}) center/cover`;
          }
        } else if (lane.key === 'jungler') {
          const bgDiv = e.currentTarget.querySelector('div[data-lane="jungler"]');
          if (bgDiv) {
            bgDiv.style.background = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${jungleBg}) center/cover`;
          }
        } else {
          e.target.style.background = '#111216';
        }
      }}
      onClick={onClick}
    >
      {/* Background image for exp, mid, roam, gold, and jungle lanes - positioned at the very back */}
      {lane.key === 'exp' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${expBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Exp lane background"
          data-lane="exp"
        />
      )}
      {lane.key === 'mid' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${midBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Mid lane background"
          data-lane="mid"
        />
      )}
      {lane.key === 'roam' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${roamBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Roam lane background"
          data-lane="roam"
        />
      )}
      {lane.key === 'gold' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${goldBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Gold lane background"
          data-lane="gold"
        />
      )}
      {lane.key === 'jungler' && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${jungleBg}) center/cover`,
            borderRadius: '12px 12px 12px 0px'
          }}
          title="Jungle lane background"
          data-lane="jungler"
        />
      )}
      <div className="relative flex-shrink-0 z-20" style={{ width: 140, height: 160, marginLeft: -30 }}>
        <img
          src={playerPhoto}
          alt="Player"
          className="absolute bottom-0 w-[140px] h-[160px] object-cover rounded-xl z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl"
          style={{ 
            objectPosition: 'center',
            left: '60%',
            transform: 'translateX(-50%)'
          }}
          onError={(e) => {
            console.error(`Failed to load image: ${playerPhoto}`);
            e.target.src = defaultPlayer;
          }}
          onLoad={() => {
            console.log(`Image loaded successfully: ${playerPhoto}`);
          }}
        />
      </div>
      <div className="flex-1 ml-8 min-w-0 flex flex-col justify-center z-30">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-white text-[1.35rem] font-bold tracking-wide truncate leading-tight">{player.name}</div>
          <div className="flex flex-col items-end ml-4 min-w-[90px] mr-8">
            <img 
              src={lane.icon} 
              alt={lane.label} 
              className="w-20 h-20 object-contain mb-1 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" 
            />
          </div>
        </div>
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
  name: 'Player',
  photo: defaultPlayer,
                // teamLogo removed
};

function PlayersStatistic() {
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
  const [allPlayerStats, setAllPlayerStats] = useState({}); // cache for all player stats
  const [allPlayerH2HStats, setAllPlayerH2HStats] = useState({}); // cache for all player H2H stats
  const [heroH2HStats, setHeroH2HStats] = useState([]); // current modal H2H stats
  const [isLoadingStats, setIsLoadingStats] = useState(false); // loading state for stats
  const [showPerformanceModal, setShowPerformanceModal] = useState(false); // performance modal state
  const [imageCache, setImageCache] = useState({}); // cache for player images
  const [currentTeamId, setCurrentTeamId] = useState(null); // track current team ID
  const statsFetchingRef = useRef(false);
  
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
    if (!teamPlayers || !teamPlayers.players) return;
    
    const newImageCache = { ...imageCache };
    const imagePromises = teamPlayers.players.map(async (player) => {
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
      try {
        // First try to get team data from localStorage
        const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
        console.log('Latest team from localStorage:', latestTeam);
        
        if (latestTeam && latestTeam.teamName) {
          // Fetch fresh team data from backend to ensure we have the latest
          const response = await fetch(`/api/teams/active`);
          if (response.ok) {
            const activeTeam = await response.json();
            console.log('Active team from API:', activeTeam);
            
            // Update localStorage with fresh data
            const updatedTeamData = {
              teamName: activeTeam.name,
              players: activeTeam.players_data || [],
              id: activeTeam.id
            };
            
            console.log('Updated team data:', updatedTeamData);
            localStorage.setItem('latestTeam', JSON.stringify(updatedTeamData));
            setTeamPlayers(updatedTeamData);
            setCurrentTeamId(activeTeam.id);
          } else {
            console.log('API response not ok, using localStorage data');
            // Fallback to localStorage data
            setTeamPlayers(latestTeam);
          }
        } else {
          console.log('No latestTeam in localStorage');
          setTeamPlayers(null);
        }
      } catch (error) {
        console.error('Error loading team data:', error);
        // Fallback to localStorage data
        const latestTeam = JSON.parse(localStorage.getItem('latestTeam'));
        setTeamPlayers(latestTeam || null);
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

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
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
    if (teamPlayers && teamPlayers.players && teamPlayers.teamName) {
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
            teamPlayers.players.map(async (p) => {
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

  function getPlayerNameForLane(laneKey, laneIdx) {
    if (!teamPlayers || !teamPlayers.players) {
      console.log('No teamPlayers or players data:', { teamPlayers });
      return `Player ${laneIdx + 1}`;
    }
    
    console.log('Looking for lane:', laneKey, 'in players:', teamPlayers.players);
    
    const found = teamPlayers.players.find(
      p => p.role && p.role.toLowerCase().includes(laneKey)
    );
    
    if (found && found.name) {
      console.log('Found player for lane', laneKey, ':', found.name);
      return found.name;
    }
    
    if (teamPlayers.players[laneIdx] && teamPlayers.players[laneIdx].name) {
      console.log('Using player at index', laneIdx, ':', teamPlayers.players[laneIdx].name);
      return teamPlayers.players[laneIdx].name;
    }
    
    console.log('No player found for lane', laneKey, ', returning default');
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
      'roam': 'roam'
    };
    return roleMap[laneKey] || laneKey;
  }

  function getHeroForLaneByLaneKey(laneKey, lanePlayers) {
    if (!lanePlayers) return null;
    const found = Array.isArray(lanePlayers)
      ? lanePlayers.find(p => p && p.lane && p.lane.toLowerCase() === laneKey)
      : null;
    return found ? found.hero : null;
  }

  function handleFileSelect(e, playerName, playerRole) {
    const file = e.target.files[0];
    if (!file || !playerName) return;
    const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
    setPendingPhoto({ file, playerName, playerRole, playerIdentifier });
    setShowConfirmModal(true);
  }

  async function handleConfirmUpload() {
    if (!pendingPhoto) return;
    setUploadingPlayer(pendingPhoto.playerName);
    try {
      const formData = new FormData();
      formData.append('photo', pendingPhoto.file);
      formData.append('playerName', pendingPhoto.playerName);
      formData.append('playerRole', pendingPhoto.playerRole);
      const response = await fetch(`/api/players/photo-by-name`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        
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
          if (!prev || !prev.players) return prev;
          return {
            ...prev,
            players: prev.players.map(p =>
              (p.name === pendingPhoto.playerName && 
               (pendingPhoto.playerRole === null ? p.role === null : p.role === pendingPhoto.playerRole)) 
                ? { ...p, photo: data.photo_path } 
                : p
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

  // Navbar links config
  const navLinks = [
    { label: 'DATA DRAFT', path: '/home' },
    { label: 'MOCK DRAFT', path: '/mock-draft' },
    { label: 'PLAYERS STATISTIC', path: '/players-statistic' },
    { label: 'WEEKLY REPORT', path: '/weekly-report' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20` }}>
      <style>{scrollbarHideStyles}</style>
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
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center flex-1" style={{ marginTop: -130 }}>
        {/* Modern Gaming Team Display Card */}
        <div className="relative group mb-8">
          <div 
            className="flex items-center bg-black hover:bg-gray-900 rounded-xl px-6 py-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            style={{ borderRadius: '12px' }}
          >
            <div className="flex items-center space-x-4">
              {/* Modern Gaming Team Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
              
              {/* Team Info */}
              <div className="flex flex-col">
                <span className="text-gray-300 text-sm font-medium tracking-wide">CURRENT TEAM</span>
                <span className="text-blue-200 font-bold text-2xl tracking-wide">{getCurrentTeamName()}</span>
              </div>
              
              {/* Modern Gaming Stats Icon */}
              <div className="ml-4 text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                <FaChartLine className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          {/* Hover Effect Border */}
          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400/50 transition-all duration-300 pointer-events-none" style={{ borderRadius: '12px' }}></div>
        </div>
        <div className="w-full flex flex-col items-center mt-12 space-y-4">
          <div className="flex flex-row justify-center gap-x-8 w-full">
            {(() => {
              const playerName = getPlayerNameForLane('exp', 0);
              const playerRole = getRoleByLaneKey('exp');
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
              const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
              return (
                <PlayerCard lane={LANES[0]} player={playerObj} hero={getHeroForLaneByLaneKey('exp', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[0], player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, hero: getHeroForLaneByLaneKey('exp', lanePlayers) })} getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} />
              );
            })()}
            {(() => {
              const playerName = getPlayerNameForLane('mid', 1);
              const playerRole = getRoleByLaneKey('mid');
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
              const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
              return (
                <PlayerCard lane={LANES[1]} player={playerObj} hero={getHeroForLaneByLaneKey('mid', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[1], player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, hero: getHeroForLaneByLaneKey('mid', lanePlayers) })} getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} />
              );
            })()}
          </div>
          <div className="flex flex-row justify-center w-full">
            {(() => {
              const playerName = getPlayerNameForLane('jungler', 2);
              const playerRole = getRoleByLaneKey('jungler');
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
              const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
              return (
                <PlayerCard lane={LANES[2]} player={playerObj} hero={getHeroForLaneByLaneKey('jungler', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[2], player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, hero: getHeroForLaneByLaneKey('jungler', lanePlayers) })} getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} />
              );
            })()}
          </div>
          <div className="flex flex-row justify-center gap-x-8 w-full">
            {(() => {
              const playerName = getPlayerNameForLane('gold', 3);
              const playerRole = getRoleByLaneKey('gold');
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
              const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
              return (
                <PlayerCard lane={LANES[3]} player={playerObj} hero={getHeroForLaneByLaneKey('gold', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[3], player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, hero: getHeroForLaneByLaneKey('gold', lanePlayers) })} getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} />
              );
            })()}
            {(() => {
              const playerName = getPlayerNameForLane('roam', 4);
              const playerRole = getRoleByLaneKey('roam');
              const playerObj = players.find(p => p.name === playerName) || { ...PLAYER, name: playerName, role: playerRole };
              const playerIdentifier = getPlayerIdentifier(playerName, playerRole);
              return (
                <PlayerCard lane={LANES[4]} player={playerObj} hero={getHeroForLaneByLaneKey('roam', lanePlayers)} onClick={() => setModalInfo({ lane: LANES[4], player: { ...playerObj, role: playerRole, identifier: playerIdentifier }, hero: getHeroForLaneByLaneKey('roam', lanePlayers) })} getPlayerPhoto={(name) => getPlayerPhoto(name, playerRole)} />
              );
            })()}
          </div>
        </div>
      </div>

      {/* Player modal */}
      {modalInfo && !showConfirmModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setModalInfo(null)}
        >
          <div 
            className="bg-[#23232a] rounded-2xl shadow-2xl p-6 min-w-[600px] max-w-[90vw] relative flex flex-col" 
            style={{ width: '700px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl font-bold" onClick={() => setModalInfo(null)}>&times;</button>
            {/* Player Profile Header */}
            <div className="flex items-center justify-center mb-6">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={e => handleFileSelect(e, modalInfo.player.name, modalInfo.player.role)}
              />
              <img
                src={getPlayerPhoto(modalInfo.player.name, modalInfo.player.role)}
                alt="Player"
                className="w-16 h-16 object-cover mr-4 rounded-full cursor-pointer"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                title="Click to upload new photo"
                style={{ opacity: uploadingPlayer === modalInfo.player.name ? 0.5 : 1, objectPosition: 'center' }}
              />
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-white text-xl font-bold">{modalInfo.player.name}</div>
                  <img src={modalInfo.lane.icon} alt={modalInfo.lane.label} className="w-12 h-12 object-contain" />
                </div>
                {uploadingPlayer === modalInfo.player.name && <div className="text-blue-300 text-xs mt-1">Uploading...</div>}
              </div>
            </div>
            

            
            {/* Hero stats table */}
            <div className="w-full">
              <div className="text-yellow-300 font-bold mb-2">PLAYER'S HERO SUCCESS RATE (Scrim)</div>
              {isLoadingStats ? (
                <div className="text-center py-4">
                  <div className="text-blue-300 flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                    <span className="text-sm">Loading stats...</span>
                  </div>
                </div>
              ) : heroStats.length > 0 ? (
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
            <div className="mt-8 w-full">
              <div className="text-yellow-300 font-bold mb-2">PLAYER'S HERO SUCCESS RATE vs ENEMY (H2H)</div>
              {isLoadingStats ? (
                <div className="text-center py-4">
                  <div className="text-blue-300 flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                    <span className="text-sm">Loading stats...</span>
                  </div>
                </div>
              ) : heroH2HStats.length > 0 ? (
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
              ) : (
                <div className="text-gray-400">No H2H stats available.</div>
              )}
            </div>
            

            
            <div className="text-gray-300 text-left mt-2">
              {heroStats.length === 0 && (
                'More player/lane/hero details can go here.'
              )}
            </div>
            
            {/* View Performance Button */}
            <div className="mt-6 w-full flex justify-center">
              <button
                onClick={() => setShowPerformanceModal(true)}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors duration-200 shadow-lg"
              >
                View Performance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Performance Modal */}
      {showPerformanceModal && modalInfo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90" style={{ pointerEvents: 'auto' }}>
          <div className="bg-[#23232a] rounded-2xl shadow-2xl p-6 min-w-[1400px] max-w-[95vw] h-[800px] flex flex-col z-[10000]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">{modalInfo.player.name} - Performance Analysis</h2>
              <button 
                className="text-gray-400 hover:text-white text-2xl font-bold" 
                onClick={() => setShowPerformanceModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
              {/* Evaluation Forms Section - Now on top */}
              <div className="w-full flex gap-4">
                {/* Hero Evaluation */}
                <div className="flex-1 bg-gray-800 p-3 rounded-lg">
                  <div className="text-yellow-300 font-bold mb-2 text-sm">HERO EVALUATION</div>
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1">
                      <label className="text-white text-xs">Date:</label>
                      <input
                        type="text"
                        value={heroEvaluation.date}
                        onChange={(e) => handleHeroEvaluationTextChange('date', e.target.value)}
                        className="w-full px-1 py-1 bg-gray-700 text-white rounded text-xs"
                        placeholder="Date"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-white text-xs">Commitment:</label>
                      <input
                        type="text"
                        value={heroEvaluation.commitment}
                        onChange={(e) => handleHeroEvaluationTextChange('commitment', e.target.value)}
                        className="w-full px-1 py-1 bg-gray-700 text-white rounded text-xs"
                        placeholder="Commitment"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-white text-xs">Goal:</label>
                      <input
                        type="text"
                        value={heroEvaluation.goal}
                        onChange={(e) => handleHeroEvaluationTextChange('goal', e.target.value)}
                        className="w-full px-1 py-1 bg-gray-700 text-white rounded text-xs"
                        placeholder="Goal"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1 mb-2">
                    <div className="bg-black text-white text-center text-xs py-1 rounded">Black</div>
                    <div className="bg-blue-600 text-white text-center text-xs py-1 rounded">Blue</div>
                    <div className="bg-red-600 text-white text-center text-xs py-1 rounded">Red</div>
                  </div>
                  
                  <div className="space-y-1 max-h-48 overflow-y-scroll scrollbar-hide">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="grid grid-cols-3 gap-1">
                        <input
                          type="text"
                          value={heroEvaluation.blackHeroes[index]}
                          onChange={(e) => handleHeroEvaluationChange('blackHeroes', index, e.target.value)}
                          className="px-1 py-1 bg-black text-white rounded text-xs text-center"
                          placeholder="Hero"
                        />
                        <input
                          type="text"
                          value={heroEvaluation.blueHeroes[index]}
                          onChange={(e) => handleHeroEvaluationChange('blueHeroes', index, e.target.value)}
                          className="px-1 py-1 bg-blue-600 text-white rounded text-xs text-center"
                          placeholder="Hero"
                        />
                        <input
                          type="text"
                          value={heroEvaluation.redHeroes[index]}
                          onChange={(e) => handleHeroEvaluationChange('redHeroes', index, e.target.value)}
                          className="px-1 py-1 bg-red-600 text-white rounded text-xs text-center"
                          placeholder="Hero"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Player Evaluation */}
                <div className="flex-1 bg-gray-800 p-3 rounded-lg">
                  <div className="text-yellow-300 font-bold mb-2 text-sm">PLAYER EVALUATION</div>
                  <div className="flex gap-2 mb-2">
                    <div className="w-1/4">
                      <label className="text-white text-xs">Date:</label>
                      <input
                        type="text"
                        value={playerEvaluation.date}
                        onChange={(e) => handlePlayerEvaluationChange('date', e.target.value)}
                        className="w-full px-1 py-1 bg-green-600 text-white rounded text-xs"
                        placeholder="Date"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-white text-xs">Notes:</label>
                      <textarea
                        value={playerEvaluation.notes || ''}
                        onChange={(e) => handlePlayerEvaluationChange('notes', e.target.value)}
                        className="w-full px-1 py-1 bg-green-600 text-white rounded text-xs resize-none"
                        placeholder="Notes"
                        rows="2"
                        style={{ height: 'auto', minHeight: '32px' }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">Quality</div>
                    <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">1-4</div>
                    <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">5-6</div>
                    <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">7-8</div>
                    <div className="bg-green-600 text-white text-center py-1 text-xs font-bold">9-10</div>
                  </div>
                  
                  <div className="space-y-1 max-h-48 overflow-y-scroll scrollbar-hide">
                    {Object.entries(playerEvaluation.qualities).slice(0, 10).map(([quality, rating], index) => (
                      <div key={quality} className="grid grid-cols-5 gap-1">
                        <div className="bg-green-200 text-black px-1 py-1 text-xs font-semibold truncate">{quality}</div>
                        <button
                          onClick={() => handleQualityRating(quality, '1-4')}
                          className={`px-1 py-1 text-xs font-bold ${rating === '1-4' ? 'bg-green-500 text-white' : 'bg-white text-black'} rounded cursor-pointer hover:bg-green-300`}
                        >
                          {rating === '1-4' ? '✓' : ''}
                        </button>
                        <button
                          onClick={() => handleQualityRating(quality, '5-6')}
                          className={`px-1 py-1 text-xs font-bold ${rating === '5-6' ? 'bg-green-500 text-white' : 'bg-white text-black'} rounded cursor-pointer hover:bg-green-300`}
                        >
                          {rating === '5-6' ? '✓' : ''}
                        </button>
                        <button
                          onClick={() => handleQualityRating(quality, '7-8')}
                          className={`px-1 py-1 text-xs font-bold ${rating === '7-8' ? 'bg-green-500 text-white' : 'bg-white text-black'} rounded cursor-pointer hover:bg-green-300`}
                        >
                          {rating === '7-8' ? '✓' : ''}
                        </button>
                        <button
                          onClick={() => handleQualityRating(quality, '9-10')}
                          className={`px-1 py-1 text-xs font-bold ${rating === '9-10' ? 'bg-green-500 text-white' : 'bg-white text-black'} rounded cursor-pointer hover:bg-green-300`}
                        >
                          {rating === '9-10' ? '✓' : ''}
                        </button>
                      </div>
                    ))}
                  </div>
                  

                </div>
              </div>
              
              {/* Chart Section - Now below the tables */}
              <div className="w-full flex justify-start">
                <div className="w-1/2">
                  <div className="text-yellow-300 font-bold mb-3 text-sm">PLAYER'S HERO PERFORMANCE CHART</div>
                  {heroStats.length > 0 && (
                    <div className="w-full bg-gray-800 rounded-lg p-3" style={{ height: '300px' }}>
                    <Bar
                      data={{
                        labels: heroStats.map(row => row.hero),
                        datasets: [
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
                            order: 0,
                            z: 10,
                          },
                          {
                            label: 'WIN',
                            data: heroStats.map(row => Math.round(row.win)),
                            backgroundColor: '#3b82f6',
                            order: 1,
                          },
                          {
                            label: 'LOSE',
                            data: heroStats.map(row => Math.round(row.lose)),
                            backgroundColor: '#f87171',
                            order: 2,
                          },
                          {
                            label: 'TOTAL',
                            data: heroStats.map(row => Math.round(row.total)),
                            backgroundColor: '#22c55e',
                            order: 3,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'top' },
                          tooltip: { mode: 'index', intersect: false },
                        },
                        scales: {
                          y: { 
                            beginAtZero: true, 
                            title: { display: true, text: 'Count' },
                            ticks: {
                              stepSize: 1,
                              callback: function(value) {
                                return Math.round(value);
                              }
                            }
                          },
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
                                          />
                    </div>
                  )}
                </div>
              </div>
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

export default PlayersStatistic;
