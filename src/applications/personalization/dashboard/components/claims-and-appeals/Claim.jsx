import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import {
  getClaimStatusDescription,
  isClaimComplete,
  getClaimType,
} from '../../utils/claims-helpers';
import { replaceDashesWithSlashes as replace } from '../../utils/date-formatting/helpers';

const capitalizeFirstLetter = input => {
  const capitalizedFirstLetter = input[0].toUpperCase();
  return `${capitalizedFirstLetter}${input.slice(1)}`;
};

function handleViewClaim() {
  recordEvent({
    event: 'dashboard-navigation',
    'dashboard-action': 'view-button',
    'dashboard-product': 'view-claim',
  });
}

const claimInfo = claim => {
  return {
    inProgress: !isClaimComplete(claim),
    claimDate: claim.attributes.claimDate,
    status: getClaimStatusDescription(claim.attributes.status),
  };
};

const Claim = ({ claim }) => {
  if (!claim.attributes) {
    throw new TypeError(
      '`claim` prop is malformed; it should have an `attributes` property.',
    );
  }
  const { inProgress, claimDate, status } = claimInfo(claim);
  const dateRecd = format(new Date(replace(claimDate)), 'MMMM d, yyyy');

  const content = (
    <>
      <h3 className="vads-u-margin-top--0 dd-privacy-mask">
        {capitalizeFirstLetter(getClaimType(claim))} claim received:
        <br />
        {dateRecd}
      </h3>
      <div className="vads-u-display--flex">
        <va-icon
          icon="check_circle"
          size={2}
          srtext="Success"
          class="vads-u-margin-right--1 vads-u-margin-top--0p5 vads-u-color--green"
        />
        <div>
          <p className="vads-u-margin-y--0">Status: {status}</p>
          {inProgress && claim.attributes.developmentLetterSent ? (
            <p className="vads-u-margin-y--0">
              We sent you a development letter
            </p>
          ) : null}
          {claim.attributes.decisionLetterSent ? (
            <p className="vads-u-margin-y--0">We sent you a decision letter</p>
          ) : null}
          {inProgress && claim.attributes.documentsNeeded ? (
            <p className="vads-u-margin-y--0">Items need attention</p>
          ) : null}
        </div>
      </div>
      <div className="vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Review details"
          label={`Review claim received ${dateRecd}`}
          href={`/track-claims/your-claims/${claim.id}/status`}
          onClick={handleViewClaim}
        />
      </div>
    </>
  );

  return (
    <div className="vads-u-margin-bottom--2">
      <va-card>{content}</va-card>
    </div>
  );
};

Claim.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default Claim;
