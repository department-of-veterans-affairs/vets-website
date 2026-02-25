import React from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import { formatDateLong } from 'platform/utilities/date';

const downloadUrl = `${environment.API_URL}/v0/coe/download_coe`;

export const Available = ({ referenceNumber, requestDate }) => (
  <va-alert status="success" class="vads-u-margin-bottom--4">
    <h2 slot="headline">Review and download your COE</h2>
    <p className="vads-u-margin-bottom--0">
      You requested a COE on {requestDate && formatDateLong(requestDate)}.
    </p>
    <p className="vads-u-margin-top--0">Reference Number: {referenceNumber}</p>
    <p>
      We already have the information we need. So you don’t need to submit a
      request for a COE. You can download your COE now.
    </p>
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
    <p className="vads-u-margin-bottom--0">
      <span className="vads-u-font-weight--bold">Note:</span> Review your
      eligibility before submitting another request
    </p>
  </va-alert>
);

Available.propTypes = {
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.string.isRequired,
};
