import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

const statusMap = {
  CLAIM_RECEIVED: 'Step 1 of 5: Claim received',
  INITIAL_REVIEW: 'Step 2 of 5: Initial review',
  EVIDENCE_GATHERING_REVIEW_DECISION:
    'Step 3 of 5: Evidence gathering, review, and decision',
  PREPARATION_FOR_NOTIFICATION: 'Step 4 of 5: Preparation for notification',
  COMPLETE: 'Step 5 of 5: Closed',
};

function getStatusDescription(status) {
  return statusMap[status];
}

function WhatWeAreDoing({ claim }) {
  const { status } = claim.attributes;

  const humanStatus = getStatusDescription(status);

  return (
    <div className="what-were-doing-container vads-u-margin-bottom--4">
      <h3 className="vads-u-margin-bottom--3">What we’re doing</h3>
      <va-card uswds="false">
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
          {humanStatus}
        </h4>
        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0p5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam.
        </p>
        <Link
          aria-label="Overview of the process"
          className="vads-u-margin-top--1 active-va-link"
          to={`your-claims/${claim.id}/overview`}
        >
          Overview of the process
          <i aria-hidden="true" />
        </Link>
      </va-card>
    </div>
  );
}

WhatWeAreDoing.propTypes = {
  claim: PropTypes.object,
  status: PropTypes.bool,
};

export default WhatWeAreDoing;
