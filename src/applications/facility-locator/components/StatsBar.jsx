import React from 'react';
import PropTypes from 'prop-types';

function StatsBar({ percent, color = 'blue' }) {
  return (
    <div className="fl-stats-bar-container">
      <div className="fl-stats-bar">
        <div
          className={`fl-stats-bar-inner ${color}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div>
        <strong>{percent.toFixed(0)} %</strong>
      </div>
    </div>
  );
}

StatsBar.propTypes = {
  percent: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['blue', 'grey']),
};

export default StatsBar;
