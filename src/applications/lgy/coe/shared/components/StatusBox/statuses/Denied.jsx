import React from 'react';
import PropTypes from 'prop-types';

import { getAppUrl } from 'platform/utilities/registry-helpers';

const coeStatusUrl = getAppUrl('coe-status');

const Denied = ({ referenceNumber, requestDate }) => (
  <va-alert status="info">
    <h2 slot="headline">We denied your request for a COE</h2>
    <div>
      <p>You requested a COE on: {requestDate}</p>
      <p>
        We reviewed your request. You don’t qualify for a COE.
        <br />
        <a href={coeStatusUrl}>
          Go to your VA home loan COE page to see status details
        </a>
      </p>
      <p>Reference Number: {referenceNumber}</p>
    </div>
  </va-alert>
);

Denied.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.number.isRequired,
};

export default Denied;
