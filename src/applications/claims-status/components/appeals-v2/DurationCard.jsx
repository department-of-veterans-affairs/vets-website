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
    <va-card background class="duration-card">
      <div className="number vads-u-font-family--serif 40px vads-u-font-size--h2 vads-u-font-weight--bold vads-u-line-height--1 vads-u-padding-bottom--2 vads-u-border-bottom--1px vads-u-border-color--gray-light">
        <i
          className="fas fa-clock vads-u-margin-right--1p5"
          aria-hidden="true"
        />
        {durationText}
      </div>
      <div className="description vads-u-font-size--base vads-u-font-weight--normal vads-u-padding-top--0p5">
        {cardDescription}
      </div>
    </va-card>
  );
};

DurationCard.propTypes = {
  durationText: PropTypes.string.isRequired,
  cardDescription: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default DurationCard;
