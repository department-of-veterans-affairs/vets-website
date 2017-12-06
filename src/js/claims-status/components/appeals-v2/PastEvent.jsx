import React from 'react';
import PropTypes from 'prop-types';

const PastEvent = ({ title, description, liClass, date }) => {
  return (
    <li role="presentation" className={`process-step ${liClass}`}>
      <h3>{title}</h3>
      <div className="appeal-event-date">on {date}</div>
      <p>{description}</p>
      <div className="separator"/>
    </li>
  );
};

PastEvent.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  liClass: PropTypes.string.isRequired,
};

export default PastEvent;
