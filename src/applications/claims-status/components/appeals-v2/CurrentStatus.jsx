import React from 'react';
import PropTypes from 'prop-types';

const CurrentStatus = ({ title, description, isClosed }) => (
  <div className={`current-status ${isClosed ? 'closed' : ''}`}>
    <h2>Current status</h2>
    <div className="current-status-content">
      <h3>{title}</h3>
      <div
        data-dd-privacy="mask"
        data-dd-action-name="current status description"
      >
        {description}
      </div>
    </div>
    {!isClosed && <div className="down-arrow" />}
  </div>
);

CurrentStatus.propTypes = {
  description: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  isClosed: PropTypes.bool,
};

export default CurrentStatus;
