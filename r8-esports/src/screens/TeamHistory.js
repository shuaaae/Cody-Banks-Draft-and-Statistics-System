import React, { useState } from 'react';
import mobaImg from '../assets/moba1.png';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // icon package like lucide-react or react-icons

export default function TeamHistory() {
  const navigate = useNavigate();
  const [teams, setTeams] = React.useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    const history = JSON.parse(localStorage.getItem('teamsHistory')) || [];
    setTeams(history);
  }, []);

  function handleSelectTeam(team) {
    localStorage.setItem('latestTeam', JSON.stringify(team));
    navigate('/home');
  }

  // Navbar links config
  const navLinks = [
    { label: 'DATA DRAFT', path: '/home' },
    { label: 'MOCK DRAFT', path: '/mock-draft' },
    { label: 'PLAYERS STATISTIC', path: '/players-statistic' },
    { label: 'TEAM HISTORY', path: '/team-history' },
    { label: 'WEEKLY REPORT', path: '/weekly-report' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${navbarBg}) center/cover, #181A20`,
      }}
    >
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
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12 px-4" style={{ marginTop: 80 }}>
        <h1 className="text-3xl font-bold text-white mb-8">Team History</h1>
        {teams.length === 0 ? (
          <div className="text-gray-400">No past teams found.</div>
        ) : (
          <div className="w-full max-w-2xl space-y-6">
            {teams.map((team, idx) => (
              <button
                key={idx}
                className="w-full bg-[#23232a] rounded-xl shadow border border-gray-700 hover:border-blue-400 transition p-6 flex flex-col items-start text-left cursor-pointer"
                onClick={() => handleSelectTeam(team)}
              >
                <div className="text-xl font-bold text-blue-300 mb-2">{team.teamName || 'Unnamed Team'}</div>
                <div className="flex flex-wrap gap-3">
                  {team.players &&
                    team.players.map((p, i) => (
                      <span
                        key={i}
                        className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {p.name} <span className="text-gray-400">({p.role})</span>
                      </span>
                    ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
