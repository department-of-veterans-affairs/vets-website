import React from 'react';
import PropTypes from 'prop-types';

const CurrentStatus = ({ title, description }) => (
  <li className="process-step section-current">
    <h2>Current Status</h2>
    <h4>{title}</h4>
    <div>{description}</div>
  </li>
);

CurrentStatus.PropTypes = {
  key: PropTypes.number,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CurrentStatus;
