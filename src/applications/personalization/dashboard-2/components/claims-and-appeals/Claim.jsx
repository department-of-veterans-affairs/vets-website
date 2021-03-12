import React from 'react';
import moment from 'moment';

import recordEvent from '~/platform/monitoring/record-event';
import {
  getPhaseDescription,
  isClaimComplete,
  getClaimType,
} from '~/applications/claims-status/utils/helpers';

const capitalizeFirstLetter = input => {
  const capitalizedFirstLetter = input[0].toUpperCase();
  return `${capitalizedFirstLetter}${input.slice(1)}`;
};

function listPhase(phase) {
  return phase === 8 ? 'Closed' : getPhaseDescription(phase);
}

function handleViewClaim() {
  recordEvent({
    event: 'dashboard-navigation',
    'dashboard-action': 'view-button',
    'dashboard-product': 'view-claim',
  });
}

const Claim = ({ claim }) => {
  const inProgress = !isClaimComplete(claim);
  const dateRecd = moment(claim.attributes.dateFiled).format('MMMM D, YYYY');
  return (
    <div className="vads-l-col--12 medium-screen:vads-l-col--6 small-desktop-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
      <div className="vads-u-padding-y--2p5 vads-u-padding-x--2p5 vads-u-background-color--gray-lightest">
        <h3 className="vads-u-margin-top--0">
          {capitalizeFirstLetter(getClaimType(claim))} claim received {dateRecd}
        </h3>
        <div className="vads-u-display--flex">
          <i
            aria-hidden="true"
            className={`fas fa-fw fa-check-circle vads-u-margin-right--1 vads-u-margin-top--0p5 vads-u-color--green`}
          />
          <div>
            <p className="vads-u-margin-y--0">
              {listPhase(claim.attributes.phase)}
            </p>
            {inProgress && claim.attributes.developmentLetterSent ? (
              <p className="vads-u-margin-y--0">
                We sent you a development letter
              </p>
            ) : null}
            {claim.attributes.decisionLetterSent ? (
              <p className="vads-u-margin-y--0">
                We sent you a decision letter
              </p>
            ) : null}
            {inProgress && claim.attributes.documentsNeeded ? (
              <p className="vads-u-margin-y--0">Items need attention</p>
            ) : null}
          </div>
        </div>
        <a
          className="usa-button-primary"
          href={`/track-claims/your-claims/${claim.id}/status`}
          aria-label={`View claim received ${dateRecd}`}
          onClick={handleViewClaim}
        >
          View details
        </a>
      </div>
    </div>
  );
};
export default Claim;
