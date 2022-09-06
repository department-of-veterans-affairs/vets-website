import React from 'react';
import PropTypes from 'prop-types';

import { formatDate, statusUrl } from './helpers';

const Available = ({ referenceNumber, requestDate }) => (
  <va-alert status="info">
    <h2 slot="headline">You already have a COE</h2>
    <div>
      <p>You requested a COE on: {formatDate(requestDate)}</p>
      <p>
        You have a COE available so you don’t need to fill out a request. You
        can review the details about your COE status or download your COE now.
        <br />
        <a href={statusUrl}>
          Go to your VA home loan COE page to review the details of your COE
        </a>
      </p>
      <p>Reference Number: {referenceNumber}</p>
    </div>
  </va-alert>
);

Available.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.number.isRequired,
};

export default Available;
