import React from 'react';
import PropTypes from 'prop-types';

const PastEvent = ({ title, date, description, hideSeparator }) => {
  const separator =
    hideSeparator === true ? null : <div className="separator" />;

  return (
    <li className="process-step section-complete">
      <h2 className="vads-u-font-size--h3">{title}</h2>
      <div className="appeal-event-date">on {date}</div>
      <p>{description}</p>
      {separator}
    </li>
  );
};

PastEvent.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  hideSeparator: PropTypes.bool,
};

export default PastEvent;
