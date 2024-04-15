import React from 'react';
import PropTypes from 'prop-types';

const CLAIM_STATUS = {
  SAVED: 'Saved',
  INCOMPLETE: 'Incomplete',
  IN_PROCESS: 'In Process',
  CLAIM_SUBMITTED: 'Claim Submitted',
  MANUAL_REVIEW: 'In Manual Review',
  ON_HOLD: 'On Hold',
  APPEALED: 'Appealed',
  // Closed has a bunch of variants.
  // TBD if we need to be more specific.
  CLOSED: 'Closed',
};

export default function TravelClaimCard(props) {
  const {
    id,
    createdOn,
    claimStatus,
    claimName,
    claimNumber,
    appointmentName,
    appointmentDate,
    modifiedOn,
  } = props;

  return (
    <va-card key={id} class="travel-claim-card vads-u-margin-bottom--2">
      {claimStatus === 'IN_PROCESS' && (
        <span className="usa-label uswds-system-color-gold-20v">
          In Progress
        </span>
      )}
      <h2 className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        Travel claim
      </h2>
      <p className="vads-u-margin-top--0">Received on {createdOn}</p>
      <p>
        Status: {CLAIM_STATUS[claimStatus]} <br />
        Claim name: {claimName} <br />
        Claim number: {claimNumber} <br />
        Appointment name: {appointmentName} <br />
        Appointment date: {appointmentDate} <br />
        Last updated: {modifiedOn}
      </p>
      <va-link href="" text="View details" />
    </va-card>
  );
}

TravelClaimCard.propTypes = {
  appointmentDate: PropTypes.string,
  appointmentName: PropTypes.string,
  claimName: PropTypes.string,
  claimNumber: PropTypes.string,
  claimStatus: PropTypes.string,
  createdOn: PropTypes.string,
  id: PropTypes.string,
  modifiedOn: PropTypes.string,
};
