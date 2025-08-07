import React, { useState } from 'react';
import { FaBolt, FaTimes, FaPlay } from 'react-icons/fa';
import DraftBoard from '../MockDraft/DraftBoard';

// Lane options
const LANE_OPTIONS = [
  { key: 'exp', label: 'Exp Lane' },
  { key: 'jungler', label: 'Jungler' },
  { key: 'mid', label: 'Mid Lane' },
  { key: 'gold', label: 'Gold Lane' },
  { key: 'roam', label: 'Roam' },
];

// Lane to hero type mapping for picks
const LANE_TYPE_MAP = {
  exp: 'Fighter',
  jungler: 'Assassin',
  mid: 'Mage',
  gold: 'Marksman',
  roam: 'Support', // or 'Tank' if you want both, but for now Support
};

export default function ExportModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onReset,
  banning,
  picks,
  turtleTakenBlue,
  setTurtleTakenBlue,
  turtleTakenRed,
  setTurtleTakenRed,
  lordTakenBlue,
  setLordTakenBlue,
  lordTakenRed,
  setLordTakenRed,
  notes,
  setNotes,
  playstyle,
  setPlaystyle,
  matchDate,
  setMatchDate,
  winner,
  setWinner,
  blueTeam,
  setBlueTeam,
  redTeam,
  setRedTeam,
  onBanClick,
  onPickClick,
  setBanning,
  setPicks,
  heroList = []
}) {
  const [showDraft, setShowDraft] = useState(false);

  // Mock Draft state for the draft interface
  const [currentStep, setCurrentStep] = useState(0);
  const [draftSteps, setDraftSteps] = useState([]);
  const [draftFinished, setDraftFinished] = useState(false);
  const [draftBans, setDraftBans] = useState({ blue: [], red: [] });
  const [draftPicks, setDraftPicks] = useState({ blue: [], red: [] });
  const [heroLoading, setHeroLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleBackgroundClick = (e) => {
    // Only close if clicking directly on the background overlay
    // Don't close if clicking on modal content or inner modals
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle comprehensive draft for both teams
  const handleComprehensiveDraft = () => {
    // Initialize complete draft steps: bans first, then picks
    const completeDraftSteps = [
      // Blue Team Bans (5 bans)
      { type: 'ban', team: 'blue', step: 0 },
      { type: 'ban', team: 'blue', step: 1 },
      { type: 'ban', team: 'blue', step: 2 },
      { type: 'ban', team: 'blue', step: 3 },
      { type: 'ban', team: 'blue', step: 4 },
      
      // Red Team Bans (5 bans)
      { type: 'ban', team: 'red', step: 5 },
      { type: 'ban', team: 'red', step: 6 },
      { type: 'ban', team: 'red', step: 7 },
      { type: 'ban', team: 'red', step: 8 },
      { type: 'ban', team: 'red', step: 9 },
      
      // Blue Team Picks (5 picks with lanes)
      { type: 'pick', team: 'blue', lane: 'exp', label: 'Exp Lane', role: 'Fighter', step: 10 },
      { type: 'pick', team: 'blue', lane: 'jungler', label: 'Jungler', role: 'Assassin', step: 11 },
      { type: 'pick', team: 'blue', lane: 'mid', label: 'Mid Lane', role: 'Mage', step: 12 },
      { type: 'pick', team: 'blue', lane: 'gold', label: 'Gold Lane', role: 'Marksman', step: 13 },
      { type: 'pick', team: 'blue', lane: 'roam', label: 'Roam', role: 'Support', step: 14 },
      
      // Red Team Picks (5 picks with lanes)
      { type: 'pick', team: 'red', lane: 'exp', label: 'Exp Lane', role: 'Fighter', step: 15 },
      { type: 'pick', team: 'red', lane: 'jungler', label: 'Jungler', role: 'Assassin', step: 16 },
      { type: 'pick', team: 'red', lane: 'mid', label: 'Mid Lane', role: 'Mage', step: 17 },
      { type: 'pick', team: 'red', lane: 'gold', label: 'Gold Lane', role: 'Marksman', step: 18 },
      { type: 'pick', team: 'red', lane: 'roam', label: 'Roam', role: 'Support', step: 19 }
    ];
    
          setDraftSteps(completeDraftSteps);
      setCurrentStep(0);
      setDraftFinished(false);
      setDraftPicks({ blue: [], red: [] });
      setDraftBans({ blue: [], red: [] });
      setShowDraft(true);
  };

  // Handle hero selection in draft
  const handleHeroSelect = (hero) => {
    if (currentStep >= draftSteps.length) return;

    const currentDraftStep = draftSteps[currentStep];
    
    if (currentDraftStep.type === 'ban') {
      // Handle ban selection - store the complete hero object
      setDraftBans(prev => ({
        ...prev,
        [currentDraftStep.team]: [...prev[currentDraftStep.team], hero]
      }));
    } else if (currentDraftStep.type === 'pick') {
      // Handle pick selection - store the complete hero object directly (like bans)
      // Add lane information to the hero object
      const heroWithLane = {
        ...hero,
        lane: currentDraftStep.lane
      };

      setDraftPicks(prev => ({
        ...prev,
        [currentDraftStep.team]: [...prev[currentDraftStep.team], heroWithLane]
      }));
    }

    // Move to next step
    if (currentStep < draftSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Draft is complete
      setDraftFinished(true);
    }
  };

  // Handle draft completion
  const handleDraftComplete = () => {
    // Update the banning state - extract hero names from hero objects
    // Distribute 5 bans: 3 in phase 1, 2 in phase 2
    setBanning({
      blue1: draftBans.blue.slice(0, 3).map(hero => hero.name), // First 3 bans for phase 1
      blue2: draftBans.blue.slice(3, 5).map(hero => hero.name), // Last 2 bans for phase 2
      red1: draftBans.red.slice(0, 3).map(hero => hero.name),   // First 3 bans for phase 1
      red2: draftBans.red.slice(3, 5).map(hero => hero.name)    // Last 2 bans for phase 2
    });

    // Update the picks state - extract hero names and lane info from hero objects
    setPicks({
      blue: {
        1: draftPicks.blue.slice(0, 3).map(hero => ({
          hero: hero.name,
          lane: hero.lane,
          role: hero.role
        })), // First 3 picks for phase 1
        2: draftPicks.blue.slice(3, 5).map(hero => ({
          hero: hero.name,
          lane: hero.lane,
          role: hero.role
        }))  // Last 2 picks for phase 2
      },
      red: {
        1: draftPicks.red.slice(0, 3).map(hero => ({
          hero: hero.name,
          lane: hero.lane,
          role: hero.role
        })), // First 3 picks for phase 1
        2: draftPicks.red.slice(3, 5).map(hero => ({
          hero: hero.name,
          lane: hero.lane,
          role: hero.role
        }))  // Last 2 picks for phase 2
      }
    });

    setShowDraft(false);
  };

  // Check if current slot is active
  const isActiveSlot = (slotType, slotTeam, slotIndex) => {
    if (currentStep >= draftSteps.length) return false;
    
    const currentDraftStep = draftSteps[currentStep];
    return currentDraftStep.type === slotType && 
           currentDraftStep.team === slotTeam && 
           slotIndex === currentStep;
  };

  // Handle double-click to remove hero from slot
  const handleHeroRemove = (slotType, slotTeam, slotIndex) => {
    if (slotType === 'ban') {
      setDraftBans(prev => ({
        ...prev,
        [slotTeam]: prev[slotTeam].filter((_, index) => index !== slotIndex)
      }));
    } else if (slotType === 'pick') {
      setDraftPicks(prev => ({
        ...prev,
        [slotTeam]: prev[slotTeam].filter((_, index) => index !== slotIndex)
      }));
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
        <div 
          style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: 'rgba(30, 41, 59, 0.85)', zIndex: 1000 }} 
          onClick={handleBackgroundClick} 
        />
        <div className="modal-box w-full max-w-[110rem] rounded-2xl shadow-2xl p-8 px-20" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1001, borderRadius: 24, background: '#101014', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
          {/* Focus trap to prevent date input from being auto-focused */}
          <button
            type="button"
            tabIndex={0}
            style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
            aria-hidden="true"
            id="modal-focus-trap"
          />
          <h2 className="text-2xl font-bold text-white mb-6">Data Draft Input</h2>
          
          {/* Comprehensive Draft Button */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg font-bold">Complete Draft</h3>
                <p className="text-blue-100 text-sm">Handle all bans and picks for both teams in one session</p>
              </div>
              <button
                type="button"
                onClick={handleComprehensiveDraft}
                className="flex items-center gap-3 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                <FaPlay className="w-5 h-5" />
                Enter Complete Draft
              </button>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-7 gap-6 items-center text-white text-sm font-semibold mb-2">
              <label className="col-span-1">Date</label>
              <label className="col-span-1">Results</label>
              <label className="col-span-1">Team</label>
              <label className="col-span-1">Banning phase 1</label>
              <label className="col-span-1">Pick</label>
              <label className="col-span-1">Banning phase 2</label>
              <label className="col-span-1">Pick</label>
            </div>
            {/* Row 1: Blue Team */}
            <div className="grid grid-cols-7 gap-6 items-center mb-2">
              {/* Date Picker */}
              <div className="relative flex items-center bg-[#181A20] rounded px-2 py-1">
                <input
                  type="date"
                  className="bg-transparent text-white rounded w-full focus:outline-none pr-8"
                  id="match-date-input"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 focus:outline-none"
                  tabIndex={-1}
                  aria-label="Pick date"
                  onClick={() => document.getElementById('match-date-input').showPicker && document.getElementById('match-date-input').showPicker()}
                >
                  {/* SVG calendar icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 7.5h16.5M4.5 21h15a.75.75 0 00.75-.75V6.75A2.25 2.25 0 0018 4.5H6A2.25 2.25 0 003.75 6.75v13.5c0 .414.336.75.75.75z" />
                  </svg>
                </button>
              </div>
              {/* Winner Field */}
              <input 
                type="text" 
                placeholder="Winner" 
                className="bg-[#181A20] text-white rounded px-2 py-1 w-full focus:outline-none" 
                id="winner-input"
                value={winner}
                onChange={(e) => setWinner(e.target.value)}
              />
              {/* Blue Team */}
              <div className="flex items-center bg-[#181A20] rounded px-2 py-1">
                <span className="mr-2 text-blue-400 text-lg">🔵</span>
                <input 
                  type="text" 
                  placeholder="Blue Team" 
                  className="bg-transparent text-white rounded focus:outline-none w-full" 
                  id="blue-team-input"
                  value={blueTeam}
                  onChange={(e) => setBlueTeam(e.target.value)}
                />
              </div>
              {/* Banning Phase 1 */}
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => onBanClick('blue1')}
              >
                {banning.blue1.length === 0 ? 'Choose a hero to ban' : banning.blue1.join(', ')}
              </button>
              {/* Pick 1 */}
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => onPickClick('blue', 1)}
              >
                {Array.isArray(picks.blue[1]) && picks.blue[1].length > 0
                  ? picks.blue[1].filter(p => p && p.lane && p.hero).map(p => p.hero).join(', ')
                  : 'Choose a hero to pick'}
              </button>
              {/* Banning Phase 2 */}
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => onBanClick('blue2')}
              >
                {banning.blue2.length === 0 ? 'Choose a hero to ban' : banning.blue2.join(', ')}
              </button>
              {/* Pick 2 */}
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => onPickClick('blue', 2)}
              >
                {Array.isArray(picks.blue[2]) && picks.blue[2].length > 0
                  ? picks.blue[2].filter(p => p && p.lane && p.hero).map(p => p.hero).join(', ')
                  : 'Choose a hero to pick'}
              </button>
            </div>
            {/* Row 2: Red Team */}
            <div className="grid grid-cols-7 gap-6 items-center mb-2">
              {/* Empty cell for alignment */}
              <div></div>
              {/* Empty cell for alignment */}
              <div></div>
              {/* Red Team */}
              <div className="flex items-center bg-[#181A20] rounded px-2 py-1">
                <span className="mr-2 text-red-400 text-lg">🔴</span>
                <input 
                  type="text" 
                  placeholder="Red Team" 
                  className="bg-transparent text-white rounded focus:outline-none w-full" 
                  id="red-team-input"
                  value={redTeam}
                  onChange={(e) => setRedTeam(e.target.value)}
                />
              </div>
              {/* Banning Phase 1 */}
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => onBanClick('red1')}
              >
                {banning.red1.length === 0 ? 'Choose a hero to ban' : banning.red1.join(', ')}
              </button>
              {/* Pick 1 */}
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => onPickClick('red', 1)}
              >
                {Array.isArray(picks.red[1]) && picks.red[1].length > 0
                  ? picks.red[1].filter(p => p && p.lane && p.hero).map(p => p.hero).join(', ')
                  : 'Choose a hero to pick'}
              </button>
              {/* Banning Phase 2 */}
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => onBanClick('red2')}
              >
                {banning.red2.length === 0 ? 'Choose a hero to ban' : banning.red2.join(', ')}
              </button>
              {/* Pick 2 */}
              <button
                type="button"
                className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => onPickClick('red', 2)}
              >
                {Array.isArray(picks.red[2]) && picks.red[2].length > 0
                  ? picks.red[2].filter(p => p && p.lane && p.hero).map(p => p.hero).join(', ')
                  : 'Choose a hero to pick'}
              </button>
            </div>
            {/* Additional Fields */}
            <div className="grid grid-cols-2 gap-6">
              {/* Turtle Taken */}
              <div className="space-y-2">
                <label className="text-white text-sm font-semibold">Turtle Taken</label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">🔵</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={turtleTakenBlue}
                      onChange={(e) => setTurtleTakenBlue(e.target.value)}
                      className="w-16 px-2 py-1 bg-[#181A20] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">🔴</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={turtleTakenRed}
                      onChange={(e) => setTurtleTakenRed(e.target.value)}
                      className="w-16 px-2 py-1 bg-[#181A20] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                </div>
              </div>
              {/* Lord Taken */}
              <div className="space-y-2">
                <label className="text-white text-sm font-semibold">Lord Taken</label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">🔵</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={lordTakenBlue}
                      onChange={(e) => setLordTakenBlue(e.target.value)}
                      className="w-16 px-2 py-1 bg-[#181A20] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">🔴</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={lordTakenRed}
                      onChange={(e) => setLordTakenRed(e.target.value)}
                      className="w-16 px-2 py-1 bg-[#181A20] text-white rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Notes and Playstyle */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-white text-sm font-semibold">Notes</label>
                <textarea
                  placeholder="Enter match notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181A20] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-white text-sm font-semibold">Playstyle</label>
                <textarea
                  placeholder="Enter playstyle notes..."
                  value={playstyle}
                  onChange={(e) => setPlaystyle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#181A20] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  rows={3}
                />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={onReset}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export Match
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mock Draft Modal */}
      {showDraft && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-90">
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-full h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-6 bg-[#23232a] border-b border-gray-700">
                <div>
                  <h3 className="text-white text-2xl font-bold">Complete Draft</h3>
                  <p className="text-gray-400 text-sm">
                    Draft all bans and picks for both teams
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleDraftComplete}
                    disabled={!draftFinished}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                  >
                    Complete Draft
                  </button>
                  <button 
                    onClick={() => setShowDraft(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              {/* Mock Draft Board */}
              <div className="flex-1 overflow-hidden">
                <DraftBoard
                  currentStep={currentStep}
                  draftSteps={draftSteps}
                  draftFinished={draftFinished}
                  bans={draftBans}
                  picks={draftPicks}
                  heroList={heroList}
                  heroLoading={heroLoading}
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  handleHeroSelect={handleHeroSelect}
                  isActiveSlot={isActiveSlot}
                  handleHeroRemove={handleHeroRemove}
                  isCompleteDraft={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 