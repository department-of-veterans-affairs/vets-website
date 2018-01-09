import React from 'react';
import PropTypes from 'prop-types';

const CurrentStatus = ({ title, description }) => (
  <div className="current-status">
    <h2>Current Status</h2>
    <h3 className="section-current">{title}</h3>
    <p>{description}</p>
  </div>
);

CurrentStatus.PropTypes = {
  key: PropTypes.number,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CurrentStatus;
