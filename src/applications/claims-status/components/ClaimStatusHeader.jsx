import PropTypes from 'prop-types';
import React from 'react';
import { buildDateFormatter } from '../utils/helpers';

const isClaimComplete = claim => claim.attributes.status === 'COMPLETE';

const formatDate = date => buildDateFormatter('MMMM d, yyyy')(date);

const getLastUpdated = claim => {
  const updatedOn = formatDate(
    claim.attributes.claimPhaseDates?.phaseChangeDate,
  );

  return `Last updated: ${updatedOn}`;
};

function ClaimStatusHeader({ claim, isOpen }) {
  const inProgress = !isClaimComplete(claim) ? 'In Progress' : null;

  return (
    <div className="claim-status-header-container">
      <h2 className="vads-u-margin-y--0">Claim status</h2>
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--3 va-introtext">
        Here’s the latest information on your claim.{' '}
      </p>
      {isOpen && (
        <div className="vads-u-margin-top--0 vads-u-margin-bottom--4">
          {inProgress && <span className="usa-label">{inProgress}</span>}
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
  isOpen: PropTypes.bool,
};

export default ClaimStatusHeader;
