import React from 'react';
import PropTypes from 'prop-types';

import { formatDateLong } from 'platform/utilities/date';
import { statusUrl } from './helpers';

const Denied = ({ origin, referenceNumber, requestDate, testUrl = '' }) => (
  <va-alert status="info" class="vads-u-margin-bottom--2">
    <h2 slot="headline">We denied your request for a COE</h2>
    <div>
      <p>
        You requested a COE on: {requestDate && formatDateLong(requestDate)}
      </p>
      <p>
        We reviewed your request. You don’t qualify for a COE.
        {origin === 'form' && (
          <>
            <br />
            <a href={testUrl || statusUrl}>
              Go to your VA home loan COE page to see status details
            </a>
          </>
        )}
      </p>
      <p>Reference Number: {referenceNumber}</p>
    </div>
  </va-alert>
);

Denied.propTypes = {
  origin: PropTypes.oneOf(['form', 'status']).isRequired,
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.number.isRequired,
  testUrl: PropTypes.string,
};

export default Denied;
