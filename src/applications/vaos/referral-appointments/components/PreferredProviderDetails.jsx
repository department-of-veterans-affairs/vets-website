import React from 'react';
import PropTypes from 'prop-types';

const PreferredProviderDetails = ({ providerDetails }) => {
  return (
    <va-card background>
      <div>Your preferred provider</div>
      <div className="vads-u-font-weight--bold">
        {providerDetails.providerName}
      </div>
      <div>{providerDetails.providerGroup}</div>
      <div>{providerDetails.driveDistance}</div>
      <div>Next available: {providerDetails.nextAvailable}</div>
      <div>{providerDetails.reviewText}</div>
      <div className="vads-u-font-weight--bold vads-u-margin-top--2">
        <va-link
          aria-label="Review available appointments"
          text="Review available appointments"
          data-testid="review-available-appointments-link"
          tabindex="0"
        />
      </div>
    </va-card>
  );
};

PreferredProviderDetails.propTypes = {
  providerDetails: PropTypes.shape({
    providerName: PropTypes.string.isRequired,
    providerGroup: PropTypes.string.isRequired,
    driveDistance: PropTypes.string.isRequired,
    nextAvailable: PropTypes.string.isRequired,
    reviewText: PropTypes.string,
  }).isRequired,
};

export default PreferredProviderDetails;
