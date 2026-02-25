import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';

const downloadUrl = `${environment.API_URL}/v0/coe/download_coe`;

export const Eligible = ({ referenceNumber }) => (
  <va-alert status="success" class="vads-u-margin-bottom--4">
    <h2 slot="headline">Review and download your automatic COE</h2>
    <p>
      We already have the information we need. So you don’t need to submit a
      request for a COE. You can download your COE now.
    </p>
    <p>Reference Number: {referenceNumber}</p>
    <div>
      <va-link
        download
        filetype="PDF"
        pages="1"
        href={downloadUrl}
        filename={downloadUrl}
        text="Download your COE"
      />
    </div>
  </va-alert>
);

Eligible.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
};
