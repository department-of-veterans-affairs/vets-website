import React from 'react';
import PropTypes from 'prop-types';

const CurrentStatus = ({ title, description }) => (
  <div>
    <h3>Current Status</h3>
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

CurrentStatus.PropTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default CurrentStatus;
