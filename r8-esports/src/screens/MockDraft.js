import React, { useEffect, useState } from 'react';
import mobaImg from '../assets/moba1.png';
import bgImg from '../assets/bg.jpg';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaDraftingCompass, FaUserFriends, FaUsers, FaChartBar } from 'react-icons/fa';
import html2canvas from 'html2canvas';

export default function MockDraft() {
  const navigate = useNavigate();
  const [heroList, setHeroList] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [assignedSlots, setAssignedSlots] = useState({
    blueBans: Array(5).fill(null),
    redBans: Array(5).fill(null),
    bluePicks: Array(5).fill(null),
    redPicks: Array(5).fill(null),
  });
  const [pendingSlot, setPendingSlot] = useState(null); // { type: 'blueBans'|'redBans'|'bluePicks'|'redPicks', index: number }
  const [currentStep, setCurrentStep] = useState(-1); // -1 means not started
  const [timer, setTimer] = useState(50);
  const [timerActive, setTimerActive] = useState(false);
  const [bans, setBans] = useState({ blue: Array(5).fill(null), red: Array(5).fill(null) });
  const [picks, setPicks] = useState({ blue: Array(5).fill(null), red: Array(5).fill(null) });
  const [draftFinished, setDraftFinished] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Team names state
  const [blueTeamName, setBlueTeamName] = useState('');
  const [redTeamName, setRedTeamName] = useState('');
  // Loading state for save draft
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  useEffect(() => {
    fetch('/api/heroes')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched heroes:', data);
        setHeroList(data);
      });
  }, []);

  // Draft phase order: blue-red-blue-red-blue-red (ban), blue-red-blue-red-blue-red (pick), blue-red-blue-red (ban), blue-red-blue-red (pick)
  const draftSteps = [
    // Ban Phase 1
    { type: 'ban', team: 'blue', index: 0 },
    { type: 'ban', team: 'red', index: 0 },
    { type: 'ban', team: 'blue', index: 1 },
    { type: 'ban', team: 'red', index: 1 },
    { type: 'ban', team: 'blue', index: 2 },
    { type: 'ban', team: 'red', index: 2 },
    // Pick Phase 1 (blue, red, red, blue, blue, red)
    { type: 'pick', team: 'blue', index: 0 },
    { type: 'pick', team: 'red', index: 0 },
    { type: 'pick', team: 'red', index: 1 },
    { type: 'pick', team: 'blue', index: 1 },
    { type: 'pick', team: 'blue', index: 2 },
    { type: 'pick', team: 'red', index: 2 },
    // Ban Phase 2 (red, blue, red, blue)
    { type: 'ban', team: 'red', index: 3 },
    { type: 'ban', team: 'blue', index: 3 },
    { type: 'ban', team: 'red', index: 4 },
    { type: 'ban', team: 'blue', index: 4 },
    // Pick Phase 2 (red, blue, blue, red)
    { type: 'pick', team: 'red', index: 3 },
    { type: 'pick', team: 'blue', index: 3 },
    { type: 'pick', team: 'blue', index: 4 },
    { type: 'pick', team: 'red', index: 4 },
  ];

  // Track banned and picked heroes for availability
  const bannedHeroes = [...bans.blue, ...bans.red].filter(Boolean);
  const pickedHeroes = [...picks.blue, ...picks.red].filter(Boolean);
  const unavailableHeroes = [...bannedHeroes, ...pickedHeroes];

  // Render pick/ban slots with + button and hero assignment
  const renderCircles = (type, team, heroes = [], size = 'w-12 h-12') => (
    Array.from({ length: 5 }).map((_, i) => {
      const hero = heroes[i];
      const isActive = isActiveSlot(type, team, i);
      let outline = '';
      if (isActive && type === 'ban') outline = 'ring-4 ring-red-500';
      else if (isActive && type === 'pick' && team === 'blue') outline = 'ring-4 ring-blue-500';
      else if (isActive) outline = 'ring-4 ring-yellow-400';
      return (
        <div
          key={i}
          className={`m-1 relative ${size} rounded-full bg-white/90 flex items-center justify-center overflow-hidden ${outline}`}
          style={{ pointerEvents: 'none', cursor: 'default' }}
        >
          {hero ? (
            <>
              <img
                src={`/heroes/${hero.role?.trim().toLowerCase()}/${hero.image}`}
                alt={hero.name}
                className="w-full h-full object-cover rounded-full"
                draggable={false}
              />
              {/* X icon overlay for banned hero */}
              {type === 'ban' && (
                <span
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  style={{
                    fontSize: 26,
                    color: 'rgba(220, 38, 38, 0.85)',
                    fontWeight: 'bold',
                    textShadow: '0 2px 8px #000',
                  }}
                >
                  &#10006;
                </span>
              )}
            </>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-2xl" style={{ color: type === 'ban' ? '#ef4444' : '#3b82f6' }}>
              {type === 'ban' ? '🚫' : '?'}
            </span>
          )}
        </div>
      );
    })
  );

  // Dynamically get unique roles from heroList, trimmed and filtered
  const uniqueRoles = Array.from(new Set(heroList.map(h => h.role?.trim()))).filter(Boolean);
  const roleButtons = ['All', ...uniqueRoles];

  // Robust filtering: trim and lowercase both sides
  const filteredHeroes = selectedType === 'All'
    ? heroList
    : heroList.filter(hero =>
        hero.role?.trim().toLowerCase() === selectedType.trim().toLowerCase()
      );

  // Remove duplicates by hero name
  const uniqueFilteredHeroes = Array.from(new Map(filteredHeroes.map(hero => [hero.name, hero])).values());

  // Debug logs
  console.log('Selected type:', selectedType);
  console.log('Filtered heroes:', filteredHeroes);

  // Check if any hero is selected in bans or picks
  const isDraftStarted = () => {
    return (
      bans.blue.some(Boolean) ||
      bans.red.some(Boolean) ||
      picks.blue.some(Boolean) ||
      picks.red.some(Boolean)
    );
  };

  // Handler to reset all slots
  function handleResetDraft() {
    setCurrentStep(-1);
    setTimer(50);
    setTimerActive(false);
    setBans({ blue: Array(5).fill(null), red: Array(5).fill(null) });
    setPicks({ blue: Array(5).fill(null), red: Array(5).fill(null) });
    setDraftFinished(false); // Reset draft finished state
  }

  // Start draft
  function handleStartDraft() {
    if (currentStep === -1) {
      setCurrentStep(0);
      setTimer(50);
      setTimerActive(true);
      setBans({ blue: Array(5).fill(null), red: Array(5).fill(null) });
      setPicks({ blue: Array(5).fill(null), red: Array(5).fill(null) });
      setDraftFinished(false); // Ensure it's false when starting
    } else if (!timerActive && !draftFinished && currentStep >= 0) {
      setTimerActive(true); // Resume timer, do not reset draft
    }
  }

  function handleStopDraft() {
    setTimerActive(false);
  }

  // Timer effect
  useEffect(() => {
    if (draftFinished) return;
    if (!timerActive || currentStep === -1) return;
    if (timer === 0) {
      // Auto-advance step
      if (currentStep + 1 < draftSteps.length) {
        setCurrentStep((step) => step + 1);
        setTimer(50);
      } else {
        setDraftFinished(true);
        setTimerActive(false);
      }
      return;
    }
    const id = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(id);
  }, [timerActive, timer, currentStep, draftFinished]);

  // Advance step after pick/ban
  function handleHeroSelect(hero) {
    if (currentStep === -1 || draftFinished) return;
    const step = draftSteps[currentStep];
    if (!step) return;
    if (step.type === 'ban') {
      setBans((prev) => {
        const updated = { ...prev };
        updated[step.team][step.index] = hero;
        return updated;
      });
    } else if (step.type === 'pick') {
      setPicks((prev) => {
        const updated = { ...prev };
        updated[step.team][step.index] = hero;
        return updated;
      });
    }
    // Next step or finish
    if (currentStep + 1 < draftSteps.length) {
      setCurrentStep((stepIdx) => stepIdx + 1);
      setTimer(50);
    } else {
      setDraftFinished(true);
      setTimerActive(false);
    }
  }

  // Skip ban function
  function handleSkipBan() {
    if (currentStep === -1 || draftFinished) return;
    const step = draftSteps[currentStep];
    if (!step || step.type !== 'ban') return;
    // Just advance to the next step, don't assign a hero
    if (currentStep + 1 < draftSteps.length) {
      setCurrentStep((stepIdx) => stepIdx + 1);
      setTimer(50);
    } else {
      setDraftFinished(true);
      setTimerActive(false);
    }
  }

  // Highlight logic for ban/pick slots
  function isActiveSlot(type, team, idx) {
    if (currentStep === -1 || draftFinished) return false;
    const step = draftSteps[currentStep];
    return step && step.type === type && step.team === team && step.index === idx;
  }

  // Navbar links config
  const navLinks = [
    { label: 'DATA DRAFT', path: '/home' },
    { label: 'MOCK DRAFT', path: '/mock-draft' },
    { label: 'PLAYERS STATISTIC', path: '/players-statistic' },
    { label: 'WEEKLY REPORT', path: '/weekly-report' },
  ];

  // Save draft as image
  async function handleSaveDraft() {
    setIsSavingDraft(true);
    try {
      const draftBoard = document.querySelector('.draft-screenshot-area');
      if (!draftBoard) return;
      // Temporarily remove box-shadow and transitions for speed
      const prevBoxShadow = draftBoard.style.boxShadow;
      const prevTransition = draftBoard.style.transition;
      draftBoard.style.boxShadow = 'none';
      draftBoard.style.transition = 'none';
      const canvas = await html2canvas(draftBoard, { backgroundColor: null, scale: 2 });
      draftBoard.style.boxShadow = prevBoxShadow;
      draftBoard.style.transition = prevTransition;
      const link = document.createElement('a');
      link.download = 'draft.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  }

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

      {/* Main Draft Board */}
      <div className="side-sections flex justify-center items-center min-h-[calc(100vh-80px)] flex-1" style={{ marginTop: 8 }}>
        <div className="flex flex-col items-center justify-center">
          {/* Screenshot area starts here */}
          <div className="draft-screenshot-area">
            <div className="draft-container flex flex-col items-center justify-center">
              <div
                className="relative w-[1200px] h-[650px] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl"
                style={{
                  backgroundImage: `url(${bgImg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginTop: 40,
                }}
              >
                
                {/* Structured Top Ban Slots */}
                <div className="absolute left-0 right-0 top-0 flex flex-row justify-center items-start w-full pt-8 z-10">
                  <div className="container flex flex-row justify-between items-start w-full" style={{ width: '100%' }}>
                    {/* Blue team name input */}
                    <div className="flex flex-col items-start pl-2" style={{ position: 'relative' }}>
                      <input
                        id="blue-team-name"
                        type="text"
                        value={blueTeamName}
                        onChange={e => setBlueTeamName(e.target.value)}
                        placeholder="Team Blue"
                        className="px-3 py-1 rounded bg-blue-700 text-white font-bold text-lg text-left mb-2 pl-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        maxLength={20}
                        style={{ zIndex: 2, position: 'relative' }}
                      />
                      <div id="left-container" className="box flex flex-row gap-2" style={{ marginTop: 0 }}>
                        {renderCircles('ban', 'blue', bans.blue, 'w-12 h-12')}
                      </div>
                    </div>
                    <div className="middle-content flex-1 flex flex-col items-center justify-center" style={{ minWidth: 220 }}>
                      {currentStep === -1 ? null : (
                        <>
                          <div className="middle-text text-2xl font-bold text-white">
                            {draftFinished ? 'Draft Finished' : draftSteps[currentStep]?.type === 'ban' ? 'Ban' : draftSteps[currentStep]?.type === 'pick' ? 'Pick' : 'Ready'}
                          </div>
                          {!draftFinished && <div id="timer" className="text-lg text-white">{timer}</div>}
                        </>
                      )}
                    </div>
                    {/* Red team name input */}
                    <div className="flex flex-col items-end pr-2" style={{ position: 'relative' }}>
                      <input
                        id="red-team-name"
                        type="text"
                        value={redTeamName}
                        onChange={e => setRedTeamName(e.target.value)}
                        placeholder="Team Red"
                        className="px-3 py-1 rounded bg-red-700 text-white font-bold text-lg text-right mb-2 pr-2 w-32 focus:outline-none focus:ring-2 focus:ring-red-400"
                        maxLength={20}
                        style={{ zIndex: 2, position: 'relative' }}
                      />
                      <div id="right-container" className="box flex flex-row gap-2" style={{ marginTop: 0 }}>
                        {renderCircles('ban', 'red', bans.red, 'w-12 h-12')}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Blue side pick slots (left) */}
                <div className="absolute left-0 flex flex-col gap-y-3" style={{ top: '140px' }}>
                  {renderCircles('pick', 'blue', picks.blue, 'w-16 h-16')}
                </div>
                {/* Red side pick slots (right) */}
                <div className="absolute right-0 flex flex-col gap-y-3" style={{ top: '140px' }}>
                  {renderCircles('pick', 'red', picks.red, 'w-16 h-16')}
                </div>
                {/* Inner Panel */}
                <div className="relative w-[900px] h-[480px] rounded-2xl bg-gradient-to-br from-[#181A20cc] via-[#23232acc] to-[#181A20cc] flex flex-col items-center justify-start pt-8 z-20 mt-16 overflow-y-auto" style={{ marginTop: '7rem' }}>
                  {/* Hero Role Tabs */}
                  <div className="flex w-full justify-center space-x-2 mb-4 flex-wrap items-center">
                    {roleButtons.map(type => (
                      <button
                        key={type}
                        className={`px-4 py-1 text-sm font-semibold transition rounded ${selectedType === type ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white hover:text-blue-400'}`}
                        onClick={() => setSelectedType(type)}
                      >
                        {type}
                      </button>
                    ))}
                    {/* Search bar */}
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search hero..."
                      className="ml-4 px-3 py-1 rounded bg-[#181A20] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                      style={{ minWidth: 160 }}
                    />
                  </div>
                  {/* Hero selection grid */}
                  <div
                    className="flex-1 w-full grid [grid-template-columns:repeat(auto-fit,minmax(5rem,1fr))] gap-x-2 gap-y-2 overflow-y-auto"
                    style={{
                      gridAutoRows: '6.5rem',
                      backgroundImage: `url(${bgImg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >

                    {uniqueFilteredHeroes
                      .filter(hero => hero.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(hero => {
                      // Only allow click if current step is ban/pick and hero is not already banned/picked
                      const step = draftSteps[currentStep];
                      const isBanned = bannedHeroes.includes(hero);
                      const isPicked = pickedHeroes.includes(hero);
                      const isDisabled = unavailableHeroes.includes(hero);
                      const isSelectable =
                        currentStep !== -1 &&
                        step &&
                        ((step.type === 'ban' && !isDisabled) ||
                         (step.type === 'pick' && !isDisabled));
                      return (
                        <button
                          key={hero.name}
                          type="button"
                          disabled={!isSelectable}
                          onClick={() => isSelectable && handleHeroSelect(hero)}
                          className="flex flex-col items-center w-full max-w-[5rem] focus:outline-none group"
                          style={isSelectable ? { cursor: 'pointer' } : { cursor: 'not-allowed', opacity: 0.5 }}
                        >
                          <img
                            src={`/heroes/${hero.role?.trim().toLowerCase()}/${hero.image}`}
                            alt={hero.name}
                            className="w-16 h-16 rounded-full object-cover transition-transform group-hover:scale-105 group-active:scale-95"
                            draggable={false}
                          />
                          <span className="text-xs text-white mt-1 text-center truncate w-full">{hero.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div> {/* End of main draft board inner panel */}
              </div> {/* End of main draft board container */}
            </div>
          </div>
          {/* Control buttons directly below the draft board, not inside screenshot area */}
          <div className="flex justify-center items-center gap-6 mt-8">
            {timerActive ? (
              <button
                className="px-8 py-2 rounded-lg text-white font-semibold transition backdrop-blur-md bg-red-600 hover:bg-red-700"
                style={{ border: 'none', boxShadow: 'none' }}
                onClick={handleStopDraft}
              >
                Stop
              </button>
            ) : (
              <button
                className="px-8 py-2 rounded-lg text-white font-semibold transition backdrop-blur-md bg-green-600 hover:bg-green-700"
                style={{ border: 'none', boxShadow: 'none' }}
                onClick={handleStartDraft}
              >
                Start
              </button>
            )}
            {timerActive && !draftFinished && draftSteps[currentStep]?.type === 'ban' && (
              <button
                className="px-8 py-2 rounded-lg text-white font-semibold transition backdrop-blur-md bg-gray-700 hover:bg-gray-600"
                style={{ border: 'none', boxShadow: 'none' }}
                onClick={handleSkipBan}
              >
                Skip Ban
              </button>
            )}
            <button
              onClick={handleResetDraft}
              className="px-8 py-2 rounded-lg text-white font-semibold transition backdrop-blur-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: 'none', boxShadow: 'none' }}
              disabled={!isDraftStarted()}
            >
              Reset Draft
            </button>
            {draftFinished && (
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="px-8 py-2 rounded-lg text-white font-semibold transition backdrop-blur-md bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ border: 'none', boxShadow: 'none' }}
              >
                {isSavingDraft ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Save Draft'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Spinner component for image loading
function Spinner() {
  return (
    <div className="w-16 h-16 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-400 rounded-full animate-spin"></div>
    </div>
  );
}

// Hero image card with smooth loading and slot assignment
function HeroImageCard({ hero, pendingSlot, setPendingSlot, assignedSlots, setAssignedSlots }) {
  const [loaded, setLoaded] = React.useState(false);
  const isSelectable = !!pendingSlot;
  function handleClick() {
    if (isSelectable && pendingSlot) {
      // Assign this hero to the pending slot
      setAssignedSlots(prev => {
        const updated = { ...prev };
        const arr = [...updated[pendingSlot.type]];
        arr[pendingSlot.index] = hero;
        updated[pendingSlot.type] = arr;
        return updated;
      });
      setPendingSlot(null);
    }
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex flex-col items-center w-full max-w-[5rem] focus:outline-none group ${isSelectable ? 'ring-2 ring-blue-400' : ''}`}
      tabIndex={0}
      disabled={!isSelectable}
      style={isSelectable ? { cursor: 'pointer' } : {}}
    >
      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden relative transition-transform group-hover:scale-105 group-active:scale-95" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>
        {!loaded && <Spinner />}
        <img
          src={`/heroes/${hero.role?.trim().toLowerCase()}/${hero.image}`}
          alt={hero.name}
          className={`w-16 h-16 rounded-full object-cover absolute top-0 left-0 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          draggable={false}
        />
      </div>
      <span className="text-xs text-white mt-1 text-center truncate w-full">{hero.name}</span>
    </button>
  );
}