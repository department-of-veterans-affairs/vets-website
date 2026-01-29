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

import CTALink from '../CTALink';

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
        {capitalizeFirstLetter(getClaimType(claim))} claim received {dateRecd}
      </h3>
      <div className="vads-u-display--flex">
        <va-icon
          icon="check_circle"
          size={2}
          srtext="Success"
          class="vads-u-margin-right--1 vads-u-margin-top--0p5 vads-u-color--green"
        />
        <div>
          <p className="vads-u-margin-y--0">{status}</p>
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
      <CTALink
        ariaLabel={`Review claim received ${dateRecd}`}
        className="vads-u-margin-top--2 vads-u-font-weight--bold"
        text="Review details"
        href={`/track-claims/your-claims/${claim.id}/status`}
        onClick={handleViewClaim}
        showArrow
      />
    </>
  );

  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-card>
        <div className="vads-u-padding--1">{content}</div>
      </va-card>
    </div>
  );
};

Claim.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default Claim;
