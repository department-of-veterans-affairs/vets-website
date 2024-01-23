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
      <span className="duration-number vads-u-font-family--serif 40px vads-u-font-size--h2 vads-u-font-weight--bold vads-u-display--block vads-u-line-height--1 vads-u-padding-bottom--2 vads-u-border-bottom--1px vads-u-border-color--gray-light">
        {durationText}
      </span>
      <span className="duration-description vads-u-font-size--base vads-u-font-weight--normal vads-u-padding-top--0p5 vads-u-display--block">
        {cardDescription}
      </span>
    </va-card>
  );
};

DurationCard.propTypes = {
  durationText: PropTypes.string.isRequired,
  cardDescription: PropTypes.string,
};

export default DurationCard;
