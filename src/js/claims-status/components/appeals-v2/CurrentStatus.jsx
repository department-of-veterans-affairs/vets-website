import React from 'react';
import PropTypes from 'prop-types';

const CurrentStatus = ({ title, description }) => (
  <div className="current-status">
    <h2>Current Status</h2>
    <div className="current-status-content">
      <h3>{title}</h3>
      <div>{description}</div>
    </div>
    <div className="down-arrow"/>
  </div>
);

CurrentStatus.PropTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.element.isRequired
};

export default CurrentStatus;
