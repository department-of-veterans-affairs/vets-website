import React from 'react';
import PropTypes from 'prop-types';

import { formatDate, statusUrl } from './helpers';

const Denied = ({ origin, referenceNumber, requestDate }) => (
  <va-alert status="info">
    <h2 slot="headline">We denied your request for a COE</h2>
    <div>
      <p>You requested a COE on: {formatDate(requestDate)}</p>
      <p>
        We reviewed your request. You don’t qualify for a COE.
        {origin === 'form' && (
          <>
            <br />
            <a href={statusUrl}>
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
  requestDate: PropTypes.number,
};

export default Denied;
