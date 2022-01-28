import React from 'react';

import ReviewAndDownload from '../../../shared/components/ReviewAndDownload';
import StatusBox from '../../../shared/components/StatusBox';

const Eligible = ({ downloadUrl }) => (
  <>
    <StatusBox.Eligible />
    <ReviewAndDownload downloadUrl={downloadUrl} />
    <div>
      <h2>What if my COE has errors?</h2>
      <p>
        Complete and submit a Request for a Certificate of Eligibility (VA Form
        26-1880) if you need to:
      </p>
      <ul>
        <li>
          Make changes to your COE (correct an error or update your
          information), <strong>or</strong>
        </li>
        <li>Apply for a restoration of entitlement</li>
      </ul>
    </div>
  </>
);

export default Eligible;
