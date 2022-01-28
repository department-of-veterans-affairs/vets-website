import React from 'react';

import ReviewAndDownload from '../../../../shared/components/ReviewAndDownload';

const COEEligible = ({ downloadUrl }) => (
  <>
    <va-alert status="success">
      <h2 slot="headline">Congratulations on your automatic COE</h2>
      <div>
        <p>
          We have all the information we need, so you don’t need to fill out a
          COE request. You can download your COE now.
        </p>
      </div>
    </va-alert>
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

export default COEEligible;
