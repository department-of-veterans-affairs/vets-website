import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import {
  getStatusDescription,
  getClaimStatusDescription,
} from '../../utils/helpers';

function WhatWeAreDoing({ claim }) {
  const { status } = claim.attributes;
  const humanStatus = getStatusDescription(status);
  const description = getClaimStatusDescription(status);

  return (
    <div className="what-were-doing-container vads-u-margin-bottom--4">
      <h3 className="vads-u-margin-bottom--3">What we’re doing</h3>
      <va-card uswds="false">
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--1">
          {humanStatus}
        </h4>
        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0p5">
          {description}
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
