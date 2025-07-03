import React, { useEffect, useState } from 'react';
import r8Logo from '../assets/r8-logo.png';
import coachLogo from '../assets/coach-logo.png';

const teamLogos = {
  'R8': r8Logo,
  'Ukraine': coachLogo,
  // Add more team logos as needed
};

function getTeamLogo(team) {
  return teamLogos[team] || null;
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase();
}

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
    <div className="min-h-screen bg-[#0a1124] text-white font-sans">
      {/* Header */}
      <header className="flex items-center px-8 py-4 bg-[#071024] border-b border-[#23283a]">
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
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-lg shadow mb-4 sm:mb-0 sm:mr-6 transition flex items-center">
              Export Match
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <h1 className="text-4xl font-bold text-blue-200 text-center">Cody Banks Draft and Statistics System</h1>
          </div>
          <div className="w-[1600px] max-w-[95vw] mx-auto mt-12 p-8 bg-[#1a1d26] shadow-2xl rounded-2xl">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-[#23283a]">
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
                              <span className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-1 rounded-full font-bold shadow-md">
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
    </div>
  );
}
