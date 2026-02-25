import React from 'react';
import PropTypes from 'prop-types';

export const EligibleAlert = ({ referenceNumber }) => (
  <va-alert status="success" class="vads-u-margin-bottom--4">
    <h2 slot="headline">You’ve been given an automatic COE</h2>
    <div>
      <p>
        We have all the information we need, so you don’t need to fill out a
        request for a COE. You can download your COE now.
      </p>
      <p className="vads-u-margin-bottom--0">
        Reference Number: {referenceNumber}
      </p>
    </div>
  </va-alert>
);

EligibleAlert.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
};
