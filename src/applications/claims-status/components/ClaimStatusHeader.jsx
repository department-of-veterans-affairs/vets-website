import React from 'react';
import PropTypes from 'prop-types';

import { buildDateFormatter, isClaimOpen } from '../utils/helpers';

export const getLastUpdated = claim => {
  const updatedOn = buildDateFormatter()(
    claim.attributes.claimPhaseDates?.phaseChangeDate,
  );

  return `Last updated: ${updatedOn}`;
};

export default function ClaimStatusHeader({ claim }) {
  const { closeDate, status } = claim.attributes;

  const isOpen = isClaimOpen(status, closeDate);

  return (
    <div className="claim-status-header-container">
      <h2 className="vads-u-margin-y--0">Claim status</h2>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--3 va-introtext">
        Here’s the latest information on your claim.
      </p>
      {isOpen && (
        <div className="vads-u-margin-bottom--4">
          <span className="usa-label">In Progress</span>
          <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
            {getLastUpdated(claim)}
          </p>
        </div>
      )}
    </div>
  );
}

ClaimStatusHeader.propTypes = {
  claim: PropTypes.object,
};
