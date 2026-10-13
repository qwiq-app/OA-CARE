import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const linkStyle = {
    display: 'block',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    marginBottom: '12px',
    transition: 'color 0.2s ease',
  };

  return (
    <footer className="footer-container">
      <div className="container-main">

        {/* Top row */}
        <div className="footer-grid">

          {/* Brand column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
            }}>
              {/* Stethoscope SVG icon */}
              <svg width="26" height="26" viewBox="0 0 24 24"
                fill="none" stroke="#11A9E2" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5 a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1 a.2.2 0 1 0 .3.3"/>
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
                <circle cx="20" cy="10" r="2"/>
              </svg>
              <span style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.3px',
              }}>
                OA Care
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              maxWidth: '260px',
            }}>
              A comprehensive patient education platform for
              Hip & Knee Osteoarthritis management.
            </p>
          </div>

          {/* LEARN column */}
          <div>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '20px',
            }}>
              LEARN
            </p>
            {[
              { label: 'About OA', to: '/about' },
              { label: 'Symptoms', to: '/symptoms' },
              { label: 'Diagnosis', to: '/diagnosis' },
              { label: 'FAQ', to: '/faq' },
            ].map(link => (
              <Link key={link.label} to={link.to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color='#11A9E2'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* TREATMENT column */}
          <div>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '20px',
            }}>
              TREATMENT
            </p>
            {[
              { label: 'Pharmacological', to: '/pharmacological' },
              { label: 'Non-Pharmacological', to: '/non-pharmacological' },
              { label: 'Exercise Library', to: '/exercises' },
              { label: 'Counselling', to: '/counselling' },
            ].map(link => (
              <Link key={link.label} to={link.to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color='#11A9E2'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RESOURCES column */}
          <div>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '20px',
            }}>
              RESOURCES
            </p>
            {[
              { label: 'Support', to: '/resources' },
              { label: 'Resources', to: '/resources' },
            ].map(link => (
              <Link key={link.label} to={link.to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color='#11A9E2'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
          }}>
            &copy; 2025 OA Care Platform. For educational purposes only.
          </p>
          <p style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
          }}>
            This site provides general information and does not
            replace professional medical advice.
          </p>
        </div>

      </div>
    </footer>
  );
}
