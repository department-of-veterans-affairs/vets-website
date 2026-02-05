import React from 'react';
import { useDemoMode } from './DemoModeContext';

/**
 * Floating toggle button for enabling/disabling demo notation mode.
 * When enabled, shows explanatory annotations throughout the UI.
 */
const DemoModeToggle = () => {
  const { isActive, toggle } = useDemoMode();

  const containerStyle = {
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: isActive ? '#fffde7' : '#f5f5f5',
    border: `2px solid ${isActive ? '#f9a825' : '#ccc'}`,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    fontFamily: 'monospace',
    fontSize: '12px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.2s ease',
  };

  const toggleStyle = {
    width: '40px',
    height: '20px',
    backgroundColor: isActive ? '#4caf50' : '#ccc',
    borderRadius: '10px',
    position: 'relative',
    transition: 'background-color 0.2s ease',
  };

  const knobStyle = {
    width: '16px',
    height: '16px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isActive ? '22px' : '2px',
    transition: 'left 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  };

  const labelStyle = {
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#f57f17' : '#666',
  };

  return (
    <div
      style={containerStyle}
      onClick={toggle}
      onKeyDown={e => e.key === 'Enter' && toggle()}
      role="switch"
      aria-checked={isActive}
      tabIndex={0}
      title="Toggle demo notation mode"
    >
      <span style={labelStyle}>Notation Mode</span>
      <div style={toggleStyle}>
        <div style={knobStyle} />
      </div>
      {isActive && <span style={{ color: '#4caf50' }}>ON</span>}
    </div>
  );
};

export default DemoModeToggle;
