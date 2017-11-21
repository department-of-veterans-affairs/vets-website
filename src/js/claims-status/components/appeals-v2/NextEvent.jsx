import React from 'react';
import PropTypes from 'prop-types';

const NextEvent = ({ title, description, cardNumber, cardDescription, showSeparator }) => {
  return (
    <li>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="card information">
        <span className="number">{cardNumber}</span>
        <span className="description">{cardDescription}</span>
      </div>
      { showSeparator && <span className="sidelines">OR</span>}
    </li>
  );
};

NextEvent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cardNumber: PropTypes.string.isRequired,
  cardDescription: PropTypes.string.isRequired,
  showSeparator: PropTypes.bool.isRequired
};

export default NextEvent;
