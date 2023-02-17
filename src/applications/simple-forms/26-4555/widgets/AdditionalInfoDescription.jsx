import React from 'react';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

const AdditionalInfoDescription = () => (
  <div
    className="vads-u-margin-top--2 vads-u-padding-left--0 vads-u-margin-bottom--2p5 addition-info-description"
    data-testid="additionalInfoDescription"
  >
    <AdditionalInfo
      status="info"
      triggerText="Why do I need to provide this information?"
    >
      <p>
        A service-connected condition is a disability related to an injury or
        disease that developed during or was aggravated while on active duty or
        active duty for training. VA also pays disability compensation for
        disabilities resulting from injury, heart attack, or stroke that
        occurred during inactive duty training.
      </p>
      <p>
        This information helps establish your basic eligibility for a Specially
        Adapted Housing Grant.
      </p>
    </AdditionalInfo>
  </div>
);

export default AdditionalInfoDescription;
