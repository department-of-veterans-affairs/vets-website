import React from 'react';
import PropTypes from 'prop-types';

const Expander = ({ title, dateRange, onToggle, cssClass }) => {
  return (
    <li className={`process-step ${cssClass}`}>
      {/* Giving this a margin top to help center the text to the li bullet */}
      <button onClick={onToggle} className="va-button-link">
        <h4 style={{ color: 'inherit' }}>{title}</h4>
      </button>
      <div className="appeal-event-date">{dateRange}</div>
      <div className="separator"/>
    </li>
  );
};

Expander.propTypes = {
  title: PropTypes.string.isRequired,
  dateRange: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  cssClass: PropTypes.string.isRequired,
};

export default Expander;
