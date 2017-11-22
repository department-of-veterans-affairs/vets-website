import React from 'react';
import PropTypes from 'prop-types';

const CurrentStatus = ({ title, description }) => (
  <li className="process-step section-current">
    <h3>Current Status</h3>
    <h4>{title}</h4>
    <p>{description}</p>
  </li>
);

CurrentStatus.PropTypes = {
  key: PropTypes.number,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CurrentStatus;
