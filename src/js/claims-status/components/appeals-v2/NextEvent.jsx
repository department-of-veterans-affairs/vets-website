import React from 'react';
import PropTypes from 'prop-types';

const NextEvent = ({ title, description, durationText, cardDescription, showSeparator }) => {
  return (
    <li className="next-event">
      <h3>{title}</h3>
      <div>{description}</div>
      <div className="card information">
        <span className="number">{durationText}</span>
        <span className="description">{cardDescription}</span>
      </div>
      { showSeparator && <span className="sidelines">or</span>}
    </li>
  );
};

NextEvent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.element.isRequired,
  durationText: PropTypes.string.isRequired,
  cardDescription: PropTypes.string.isRequired,
  showSeparator: PropTypes.bool.isRequired
};

export default NextEvent;
