import React from 'react';
import mobaImg from '../assets/moba1.jpg';
import navbarBg from '../assets/navbarbackground.jpg';
import { useNavigate } from 'react-router-dom';

export default function TeamHistory() {
  const navigate = useNavigate();
  const [teams, setTeams] = React.useState([]);

  React.useEffect(() => {
    const history = JSON.parse(localStorage.getItem('teamsHistory')) || [];
    setTeams(history);
  }, []);

  function handleSelectTeam(team) {
    localStorage.setItem('latestTeam', JSON.stringify(team));
    navigate('/home');
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
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/mock-draft')}>Mock Draft</button>
            <button className="text-gray-400 hover:text-blue-300 transition" onClick={() => navigate('/players-statistic')}>Players Statistic</button>
            <button className="text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold">Team History</button>
          </nav>
        </div>
      </header>
      {/* Main Content */}
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center py-12">
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
                  {team.players && team.players.map((p, i) => (
                    <span key={i} className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
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