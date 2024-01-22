import React from 'react';
import PropTypes from 'prop-types';

// Disabling duration card view (for now) per
// https://github.com/department-of-veterans-affairs/va.gov-team/issues/10293
const DurationCard = ({ durationText, cardDescription, isDisabled = true }) => {
  // Card's not very helpful without any actual duration information
  if (!durationText || isDisabled) {
    return null;
  }

  return (
    <va-card background>
      <span className="number">{durationText}</span>
      <span className="description">{cardDescription}</span>
    </va-card>
  );
};

DurationCard.propTypes = {
  durationText: PropTypes.string.isRequired,
  cardDescription: PropTypes.string,
};

export default DurationCard;
