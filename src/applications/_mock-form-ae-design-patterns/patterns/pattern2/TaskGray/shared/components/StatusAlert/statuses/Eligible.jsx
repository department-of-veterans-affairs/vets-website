import React from 'react';
import PropTypes from 'prop-types';

const Eligible = ({ referenceNumber }) => (
  <va-alert status="success" class="vads-u-margin-bottom--2">
    <h2 slot="headline" className="vads-u-font-size--h3">
      Congratulations on your automatic COE
    </h2>
    <p>
      We have all the information we need, so you don’t need to fill out a
      request for a COE. You can download your COE now.
    </p>
    <p>Reference Number: {referenceNumber}</p>
  </va-alert>
);

Eligible.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
};

export default Eligible;
