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
  // Closed as a bunch of variants.
  // TBD if we need to be more specific.
  CLOSED: 'Closed',
};

export default function AppointmentsTable() {
  return (
    <va-table table-title="Travel claims">
      <va-table-row slot="headers">
        <span>Travel claim Number</span>
        <span>Status</span>
        <span>Details</span>
      </va-table-row>
      <va-table-row>
        <span>#1234567</span>
        <span>
          <StatusPill status={CLAIM_STATUS.IN_PROCESS} />
        </span>
        <span>Consequat cillum, voluptate labore.</span>
      </va-table-row>
      <va-table-row>
        <span>#09876543</span>
        <span>
          <StatusPill status={CLAIM_STATUS.MANUAL_REVIEW} />
        </span>
        <span>---</span>
      </va-table-row>
    </va-table>
  );
}

function StatusPill({ status }) {
  StatusPill.propTypes = {
    status: PropTypes.oneOf(Object.values(CLAIM_STATUS)),
  };

  return (
    <span className="usa-label uswds-system-color-gold-20v">{status}</span>
  );
}
