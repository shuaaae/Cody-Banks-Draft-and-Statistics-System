import React from 'react';

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
  onBanClick,
  onPickClick
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
      <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: 'rgba(30, 41, 59, 0.85)', zIndex: 1000 }} onClick={onClose} />
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
            <input type="text" placeholder="Winner" className="bg-[#181A20] text-white rounded px-2 py-1 w-full focus:outline-none" id="winner-input" />
            {/* Blue Team */}
            <div className="flex items-center bg-[#181A20] rounded px-2 py-1">
              <span className="mr-2 text-blue-400 text-lg">🔵</span>
              <input type="text" placeholder="Blue Team" className="bg-transparent text-white rounded focus:outline-none w-full" id="blue-team-input" />
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
              {Array.isArray(picks.blue[2]) && picks.blue[2].filter(p => p && p.hero).length > 0
                ? picks.blue[2].filter(p => p && p.hero).map(p => p.hero).join(', ')
                : 'Choose a hero to pick'}
            </button>
          </div>
          {/* Row 2: Red Team */}
          <div className="grid grid-cols-7 gap-6 items-center mb-2">
            <div></div>
            <div></div>
            {/* Red Team */}
            <div className="flex items-center bg-[#181A20] rounded px-2 py-1">
              <span className="mr-2 text-red-400 text-lg">🔴</span>
              <input type="text" placeholder="Red Team" className="bg-transparent text-white rounded focus:outline-none w-full" id="red-team-input" />
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
              {Array.isArray(picks.red[2]) && picks.red[2].filter(p => p && p.hero).length > 0
                ? picks.red[2].filter(p => p && p.hero).map(p => p.hero).join(', ')
                : 'Choose a hero to pick'}
            </button>
          </div>
          {/* Turtle/Lord taken, Notes, Playstyle */}
          <div className="flex flex-wrap items-center gap-8 mt-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent select-none">
                  Turtle taken
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-400 font-semibold text-sm">Blue:</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="10"
                      className="w-16 bg-[#181A20] text-blue-400 border border-blue-500 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      value={turtleTakenBlue} 
                      onChange={e => setTurtleTakenBlue(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <span className="text-white font-bold">-</span>
                  <div className="flex items-center gap-1">
                    <span className="text-red-400 font-semibold text-sm">Red:</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="10"
                      className="w-16 bg-[#181A20] text-red-400 border border-red-500 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-400" 
                      value={turtleTakenRed} 
                      onChange={e => setTurtleTakenRed(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent select-none">
                  Lord taken
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-400 font-semibold text-sm">Blue:</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="10"
                      className="w-16 bg-[#181A20] text-blue-400 border border-blue-500 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-400" 
                      value={lordTakenBlue} 
                      onChange={e => setLordTakenBlue(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <span className="text-white font-bold">-</span>
                  <div className="flex items-center gap-1">
                    <span className="text-red-400 font-semibold text-sm">Red:</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="10"
                      className="w-16 bg-[#181A20] text-red-400 border border-red-500 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-400" 
                      value={lordTakenRed} 
                      onChange={e => setLordTakenRed(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-start">
              <label className="mr-2 text-white font-semibold mt-1">Notes:</label>
              <textarea placeholder="Notes" className="bg-[#181A20] text-white rounded-xl px-4 py-2 w-full focus:outline-none resize-none" style={{height: '120px'}} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="flex items-center">
              <label className="mr-2 text-white font-semibold">Playstyle:</label>
              <input type="text" placeholder="Playstyle" className="bg-[#181A20] text-white rounded-full px-4 py-1 w-32 focus:outline-none" value={playstyle} onChange={e => setPlaystyle(e.target.value)} />
            </div>
          </div>
          <div className="modal-action mt-6 flex justify-end gap-4">
            <button
              type="button"
              className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
              onClick={onConfirm}
            >
              Confirm
            </button>
            <button 
              type="button" 
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold" 
              onClick={onReset}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 