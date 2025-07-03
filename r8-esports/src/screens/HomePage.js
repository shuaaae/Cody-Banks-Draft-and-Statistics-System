import React, { useEffect, useState } from 'react';





export default function HomePage() {
  const [matches, setMatches] = useState([]);
  const [hoveredMatchId, setHoveredMatchId] = useState(null);
  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setMatches(data);
      })
      .catch(err => {
        setMatches([]);
        console.error(err);
      });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#181A20' }}>
      {/* Header */}
      <header className="flex items-center px-8 py-4" style={{ background: '#23232a', borderBottom: '1px solid #23283a' }}>
        <img src="/logo192.png" alt="Logo" className="h-12 w-12 rounded mr-4" />
        <div className="flex-1 flex items-center">
          <nav className="flex space-x-8 ml-4">
            <button className="text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold">Data Draft</button>
            <button className="text-gray-400 hover:text-blue-300 transition">Players Statistic</button>
            <button className="text-gray-400 hover:text-blue-300 transition">Match History</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center py-16 px-2">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-8 w-full">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow mb-4 sm:mb-0 sm:mr-6 transition flex items-center"
              onClick={() => {
                document.getElementById('my_modal_4').showModal();
                setTimeout(() => {
                  const trap = document.getElementById('modal-focus-trap');
                  if (trap) trap.focus();
                }, 50);
              }}
            >
              Export Match
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <h1 className="text-4xl font-bold text-blue-200 text-center">Cody Banks Draft and Statistics System</h1>
          </div>
          <div className="w-[1600px] max-w-[95vw] mx-auto mt-12 p-8 rounded-2xl" style={{ background: '#23232a', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.25)', border: '1px solid #23283a' }}>
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="sticky top-0 z-10" style={{ background: '#23283a' }}>
                <tr>
                  <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[120px] rounded-tl-xl">DATE</th>
                  <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[120px]">RESULTS</th>
                  <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[120px]">TEAM</th>
                  <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[220px]">Banning Phase 1</th>
                  <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[220px]">Picks</th>
                  <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[220px]">Banning Phase 2</th>
                  <th className="py-3 px-4 text-blue-300 font-bold text-center min-w-[220px] rounded-tr-xl">Picks</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <React.Fragment key={match.id}>
                    {match.teams.map((team, idx) => (
                      <tr
                        key={team.id}
                        className={
                          `transition-colors duration-200 rounded-lg ` +
                          (hoveredMatchId === match.id ? 'bg-blue-900/30' : '')
                        }
                        onMouseEnter={() => setHoveredMatchId(match.id)}
                        onMouseLeave={() => setHoveredMatchId(null)}
                      >
                        {idx === 0 && (
                          <>
                            <td className="py-3 px-4 text-center align-middle" rowSpan={match.teams.length}>{match.match_date}</td>
                            <td className="py-3 px-4 text-center align-middle" rowSpan={match.teams.length}>
                              <span className="inline-block text-white px-4 py-1 rounded-full font-bold shadow-md" style={{ background: '#22c55e' }}>
                                {match.winner}
                              </span>
                            </td>
                          </>
                        )}
                        <td className="py-3 px-4 text-center font-bold align-middle">
                          {team.team_color === 'blue' ? (
                            <span className="relative group inline-block bg-blue-500 text-white px-3 py-1 rounded font-bold cursor-pointer focus:outline-none" tabIndex={0} aria-label="1st Pick">
                              {team.team}
                              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max px-3 py-1 bg-black text-sm text-white rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                                1st Pick
                              </span>
                            </span>
                          ) : (
                            <span className="inline-block bg-red-500 text-white px-3 py-1 rounded font-bold">
                              {team.team}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center align-middle min-w-[220px]">
                          {team.banning_phase1 && team.banning_phase1.split('/').map(ban => (
                            <span key={ban} className="bg-red-500 text-white px-3 py-1 rounded-full mx-1 inline-block shadow-sm text-sm font-semibold hover:bg-red-600 transition-colors duration-200 whitespace-nowrap">{ban}</span>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-center align-middle min-w-[220px]">
                          {team.picks1 && team.picks1.split('/').map(pick => (
                            <span key={pick} className="bg-green-500 text-white px-3 py-1 rounded-full mx-1 inline-block shadow-sm text-sm font-semibold hover:bg-green-600 transition-colors duration-200 whitespace-nowrap">{pick}</span>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-center align-middle min-w-[220px]">
                          {team.banning_phase2 && team.banning_phase2.split('/').map(ban => (
                            <span key={ban} className="bg-red-500 text-white px-3 py-1 rounded-full mx-1 inline-block shadow-sm text-sm font-semibold hover:bg-red-600 transition-colors duration-200 whitespace-nowrap">{ban}</span>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-center align-middle min-w-[220px]">
                          {team.picks2 && team.picks2.split('/').map(pick => (
                            <span key={pick} className="bg-green-500 text-white px-3 py-1 rounded-full mx-1 inline-block shadow-sm text-sm font-semibold hover:bg-green-600 transition-colors duration-200 whitespace-nowrap">{pick}</span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box w-full max-w-7xl bg-[#23232a] rounded-2xl shadow-2xl p-8 px-12" style={{background: '#23232a'}}>
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
              <input type="text" placeholder="Winner" className="bg-[#181A20] text-white rounded px-2 py-1 w-full focus:outline-none" />
              {/* Blue Team */}
              <div className="flex items-center bg-[#181A20] rounded px-2 py-1">
                <span className="mr-2 text-blue-400 text-lg">🔵</span>
                <input type="text" placeholder="Blue Team" className="bg-transparent text-white rounded focus:outline-none w-full" />
              </div>
              {/* Banning Phase 1 */}
              <button type="button" className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">Choose a hero</button>
              {/* Pick 1 */}
              <button type="button" className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">Choose a hero</button>
              {/* Banning Phase 2 */}
              <button type="button" className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">Choose a hero</button>
              {/* Pick 2 */}
              <button type="button" className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">Choose a hero</button>
            </div>
            {/* Row 2: Red Team */}
            <div className="grid grid-cols-7 gap-6 items-center mb-2">
              <div></div>
              <div></div>
              {/* Red Team */}
              <div className="flex items-center bg-[#181A20] rounded px-2 py-1">
                <span className="mr-2 text-red-400 text-lg">🔴</span>
                <input type="text" placeholder="Red Team" className="bg-transparent text-white rounded focus:outline-none w-full" />
              </div>
              {/* Banning Phase 1 */}
              <button type="button" className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">Choose a hero</button>
              {/* Pick 1 */}
              <button type="button" className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">Choose a hero</button>
              {/* Banning Phase 2 */}
              <button type="button" className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">Choose a hero</button>
              {/* Pick 2 */}
              <button type="button" className="w-full px-4 py-2 rounded-lg border border-current text-white font-semibold bg-transparent hover:bg-white/10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">Choose a hero</button>
            </div>
            {/* Turtle/Lord taken, Notes, Playstyle */}
            <div className="flex flex-wrap items-center gap-8 mt-4">
              <div className="flex flex-col gap-2">
                <label className="font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent select-none">
                  Turtle taken
                  <select className="ml-2 bg-[#181A20] text-white rounded px-2 py-1" defaultValue="">
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </label>
                <label className="font-bold bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent select-none">
                  Lord taken
                  <select className="ml-2 bg-[#181A20] text-white rounded px-2 py-1" defaultValue="">
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </label>
              </div>
              <div className="flex-1 flex items-center">
                <label className="mr-2 text-white font-semibold">Notes:</label>
                <textarea placeholder="Notes" className="bg-[#181A20] text-white rounded-xl px-4 py-2 w-full focus:outline-none resize-none" style={{height: '80px'}} />
              </div>
              <div className="flex items-center">
                <label className="mr-2 text-white font-semibold">Playstyle:</label>
                <input type="text" placeholder="Playstyle" className="bg-[#181A20] text-white rounded-full px-4 py-1 w-32 focus:outline-none" />
              </div>
            </div>
            <div className="modal-action mt-6 flex justify-end gap-4">
              <button type="button" className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">Confirm</button>
              <form method="dialog">
                <button className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">Close</button>
              </form>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
