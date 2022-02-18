import React from 'react';
import PropTypes from 'prop-types';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';
import StatusAlert from '../../../shared/components/StatusAlert';

const Available = ({ downloadUrl, referenceNumber, requestDate }) => (
  <>
    <StatusAlert.Available
      referenceNumber={referenceNumber}
      requestDate={requestDate}
    />
    <ReviewAndDownload downloadUrl={downloadUrl} />
    <div>
      <h2>What if I need to make changes to my COE?</h2>
      <p>
        Complete and submit a Request for a Certificate of Eligibility (VA Form
        26-1880) if you need to:
      </p>
      <ul>
        <li>
          Make changes to your COE (correct an error or update your
          information), <strong>or</strong>
        </li>
        <li>Request a restoration of entitlement</li>
      </ul>
    </div>
  </>
);

Available.propTypes = {
  downloadUrl: PropTypes.string.isRequired,
  referenceNumber: PropTypes.string.isRequired,
  requestDate: PropTypes.number.isRequired,
};

export default Available;
