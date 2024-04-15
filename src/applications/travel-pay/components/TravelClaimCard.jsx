import React from 'react';
import PropTypes from 'prop-types';

// const CLAIM_STATUS = {
// SAVED: 'Saved',
// INCOMPLETE: 'Incomplete',
// IN_PROCESS: 'In Process',
// CLAIM_SUBMITTED: 'Claim Submitted',
// MANUAL_REVIEW: 'In Manual Review',
// ON_HOLD: 'On Hold',
// APPEALED: 'Appealed',
/// / Closed has a bunch of variants.
/// / TBD if we need to be more specific.
// CLOSED: 'Closed',
// };

export default function TravelClaimCard(props) {
  const {
    claimStatus,
    claimNumber,
    appointmentLocation,
    appointmentDate,
    createdOn,
    updatedOn,
  } = props;

  return (
    <va-card
      class="travel-claim-card vads-u-margin-bottom--2 hydrated"
      uswds="false"
    >
      <h2 className="claim-list-item-header vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--2">
        {appointmentDate} appointment
      </h2>
      <div className="card-status">
        <h4 className="claim-list-item-header vads-u-margin-bottom--0">
          <div role="text">Where</div>
        </h4>
        <p className="vads-u-margin-y--0 submitted-on">{appointmentLocation}</p>
      </div>
      <div className="card-status">
        <h4 className="claim-list-item-header vads-u-margin-bottom--0p5">
          <div role="text">Claim details</div>
        </h4>

        <p className="vads-u-margin-y--0">
          <strong>Claim status: {claimStatus}</strong>
        </p>
        <p className="vads-u-margin-y--0">Claim number: {claimNumber}</p>
        <p className="vads-u-margin-y--0">Submitted on {createdOn}</p>
        <p className="vads-u-margin-y--0">Updated on {updatedOn}</p>
      </div>
    </va-card>
  );
}

TravelClaimCard.propTypes = {
  appointmentDate: PropTypes.string,
  appointmentLocation: PropTypes.string,
  claimNumber: PropTypes.string,
  claimStatus: PropTypes.string,
  createdOn: PropTypes.string,
  updatedOn: PropTypes.string,
};
