import React, { useEffect, useState } from 'react';
import mobaImg from '../assets/moba1.jpg';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    fetch('/api/heroes')
      .then(res => res.json())
      .then(data => {
        console.log('Fetched heroes:', data);
        setHeroList(data);
      });
  }, []);

  // Render pick/ban slots with + button and hero assignment
  const renderCircles = (type, heroes = [], size = 'w-12 h-12') => (
    Array.from({ length: 5 }).map((_, i) => {
      const hero = heroes[i];
      const isPending = pendingSlot && pendingSlot.type === type && pendingSlot.index === i;
      // Outline logic
      let outline = '';
      if (type === 'bluePicks') outline = 'border-blue-500';
      if (type === 'redPicks') outline = 'border-red-500';
      if (type === 'blueBans' || type === 'redBans') outline = 'border-red-500';
      return (
        <div key={i} className={`m-2 relative ${size}`}>
          <button
            type="button"
            onClick={() => setPendingSlot({ type, index: i })}
            onDoubleClick={() => {
              if (hero) {
                setAssignedSlots(prev => {
                  const updated = { ...prev };
                  const arr = [...updated[type]];
                  arr[i] = null;
                  updated[type] = arr;
                  return updated;
                });
                setPendingSlot(null);
              }
            }}
            className={`w-full h-full rounded-full border-2 ${outline} flex items-center justify-center bg-white/90 overflow-hidden focus:outline-none transition-transform ${isPending ? 'ring-2 ring-blue-400 scale-105' : 'group-hover:scale-105 group-active:scale-95 group-hover:border-blue-400'}`}
            style={{ position: 'relative' }}
          >
            {hero ? (
              <img
                src={`/heroes/${hero.role?.trim().toLowerCase()}/${hero.image}`}
                alt={hero.name}
                className="w-full h-full object-cover rounded-full"
                draggable={false}
              />
            ) : null}
            {/* + button overlay */}
            {!hero && (
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-2xl text-blue-500 font-bold">+</span>
            )}
          </button>
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

  // Handler to reset all slots
  function handleResetDraft() {
    setAssignedSlots({
      blueBans: Array(5).fill(null),
      redBans: Array(5).fill(null),
      bluePicks: Array(5).fill(null),
      redPicks: Array(5).fill(null),
    });
    setPendingSlot(null);
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
            <button className="text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold">Mock Draft</button>
            <button className="text-gray-400 hover:text-blue-300 transition">Players Statistic</button>
            <button className="text-gray-400 hover:text-blue-300 transition">Match History</button>
          </nav>
        </div>
      </header>
      {/* Main Draft Board */}
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="relative w-[1200px] h-[650px] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl"
          style={{ background: 'linear-gradient(90deg, #11407a 0%, #11407a 48%, #a32d2d 52%, #a32d2d 100%)' }}>
          {/* Top ban slots */}
          <div className="absolute left-0 right-0 top-0 flex flex-row justify-between items-start w-full px-0 pt-8 z-10">
            {/* Blue team ban slots (left edge) */}
            <div className="flex pl-2">
              {renderCircles('blueBans', assignedSlots.blueBans, 'w-12 h-12')}
            </div>
            {/* Red team ban slots (right edge) */}
            <div className="flex pr-2">
              {renderCircles('redBans', assignedSlots.redBans, 'w-12 h-12')}
            </div>
          </div>
          {/* Blue side pick slots (left) */}
          <div className="absolute left-0 top-[90px] flex flex-col items-center h-auto z-10">
            {renderCircles('bluePicks', assignedSlots.bluePicks, 'w-16 h-16')}
          </div>
          {/* Red side pick slots (right) */}
          <div className="absolute right-0 top-[90px] flex flex-col items-center h-auto z-10">
            {renderCircles('redPicks', assignedSlots.redPicks, 'w-16 h-16')}
          </div>
          {/* Inner Panel */}
          <div className="relative w-[900px] h-[480px] rounded-2xl bg-gradient-to-br from-[#181A20cc] via-[#23232acc] to-[#181A20cc] flex flex-col items-center justify-start pt-8 z-20 mt-16 overflow-y-auto">
            {/* Hero Role Tabs */}
            <div className="flex w-full justify-center space-x-2 mb-4 flex-wrap">
              {roleButtons.map(type => (
                <button
                  key={type}
                  className={`px-4 py-1 text-sm font-semibold transition rounded ${selectedType === type ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white hover:text-blue-400'}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            {/* Hero selection grid */}
            <div className="flex-1 w-full grid [grid-template-columns:repeat(auto-fit,minmax(5rem,1fr))] gap-x-6 gap-y-4 overflow-y-auto px-4 pb-4"
     style={{ gridAutoRows: '6.5rem' }}>

              {uniqueFilteredHeroes.map(hero => (
                <HeroImageCard
                  key={hero.name}
                  hero={hero}
                  pendingSlot={pendingSlot}
                  setPendingSlot={setPendingSlot}
                  assignedSlots={assignedSlots}
                  setAssignedSlots={setAssignedSlots}
                />
              ))}
            </div>
            {/* Reset Draft Button (top, above hero role tabs) */}
            <div className="w-full flex justify-center mb-6 z-30">
              <button
                onClick={handleResetDraft}
                className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={![...assignedSlots.blueBans, ...assignedSlots.redBans, ...assignedSlots.bluePicks, ...assignedSlots.redPicks].every(Boolean)}
              >
                Reset Draft
              </button>
            </div>
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
      <div className="w-16 h-16 rounded-full border-2 border-gray-700 shadow bg-gray-800 flex items-center justify-center overflow-hidden relative transition-transform group-hover:scale-105 group-active:scale-95 group-hover:border-blue-400">
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