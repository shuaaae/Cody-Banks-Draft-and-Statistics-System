import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredBtn, setHoveredBtn] = useState(null); // 'getstarted' or 'addteam' or null
  const buttonWidth = 220;
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#181A20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 1100,
          minHeight: 480,
          aspectRatio: '16/7',
          borderRadius: 32,
          overflow: 'hidden',
          boxShadow: '0 8px 32px 0 rgba(30,40,80,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {/* Background image anchored right */}
        <img
          src={require('../assets/coach1.jpg')}
          alt="Coach Hero"
          style={{
            position: 'absolute',
            top: 0,
            left: '40%',
            width: '60%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.7) blur(1.2px) saturate(1.1)',
            zIndex: 1,
            transition: 'left 0.3s',
          }}
        />
        {/* Overlay gradient for readability, stronger on left */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(24,26,32,0.98) 0%, rgba(24,26,32,0.85) 30%, rgba(24,26,32,0.2) 65%, rgba(24,26,32,0.0) 100%)',
            zIndex: 2,
          }}
        />
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingLeft: 56,
            paddingRight: 32,
            width: '48%',
            minWidth: 220,
          }}
        >
          <h1
            style={{
              color: '#fff',
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 18,
              letterSpacing: 0.5,
              lineHeight: 1.15,
              textShadow: '0 4px 24px #000a',
            }}
          >
            Cody Banks Draft<br /> and Statistics System
          </h1>
          <p
            style={{
              color: '#f3f4f6',
              fontSize: 16,
              marginBottom: 32,
              fontWeight: 500,
              textShadow: '0 2px 12px #000a',
              maxWidth: 380,
              lineHeight: 1.5,
            }}
          >
            The ultimate draft and statistics platform for esports teams. Track, analyze, and strategize your matches with a game-inspired experience.
          </p>
          <button
            style={{
              width: buttonWidth,
              background: hoveredBtn === 'getstarted' ? 'transparent' : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
              color: hoveredBtn === 'getstarted' ? '#3b82f6' : '#fff',
              fontWeight: 800,
              fontSize: 18,
              padding: '14px 36px',
              borderRadius: 12,
              border: '2px solid ' + (hoveredBtn === 'getstarted' ? '#3b82f6' : 'transparent'),
              boxShadow: '0 4px 24px 0 #3b82f644',
              cursor: 'pointer',
              letterSpacing: 1,
              textTransform: 'uppercase',
              transition: 'background 0.25s, color 0.25s, border 0.25s',
              textShadow: '0 2px 8px #0008',
              marginBottom: 16,
              boxSizing: 'border-box',
            }}
            onClick={() => navigate('/home')}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseOver={() => setHoveredBtn('getstarted')}
          >
            Get Started
          </button>
          <button
            style={{
              width: buttonWidth,
              background: hoveredBtn === 'addteam' ? 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' : 'transparent',
              color: hoveredBtn === 'addteam' ? '#fff' : '#3b82f6',
              fontWeight: 700,
              fontSize: 17,
              padding: '12px 32px',
              borderRadius: 10,
              border: '2px solid ' + (hoveredBtn === 'addteam' ? 'transparent' : '#3b82f6'),
              cursor: 'pointer',
              letterSpacing: 1,
              textTransform: 'uppercase',
              transition: 'background 0.25s, color 0.25s, border 0.25s',
              marginBottom: 4,
              boxSizing: 'border-box',
            }}
            onMouseLeave={() => setHoveredBtn(null)}
            onMouseOver={() => setHoveredBtn('addteam')}
          >
            + Add Team
          </button>
        </div>
      </div>
      {/* Responsive: stack vertically on small screens */}
      <style>{`
        @media (max-width: 900px) {
          div[style*='aspect-ratio'] {
            aspect-ratio: unset !important;
            min-height: 340px !important;
            flex-direction: column !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          div[style*='paddingLeft: 56px'] {
            padding-left: 18px !important;
            padding-right: 18px !important;
            width: 100% !important;
          }
          h1 { font-size: 1.3rem !important; }
        }
      `}</style>
    </div>
  );
} 