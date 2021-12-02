import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

export const Sample = () => (
  <AdditionalInfo
    className="vads-u-margin-bottom--2"
    triggerText="Why aren’t all my issues listed here?"
    disableAnalytics
  >
    <p className="vads-u-margin-top--0">
      If you don’t see your issue or decision listed here, it may not be in our
      system yet. This can happen if it’s a more recent claim decision. We may
      still be processing it.
    </p>
  </AdditionalInfo>
);

export const SampleOther = () => (
  <AdditionalInfo
    triggerText="Learn more about military base addresses"
    onClick={null}
    disableAnalytics
    status="info"
  >
    <span>
      The United States is automatically chosen as your country if you live on a
      military base outside of the country.
    </span>
  </AdditionalInfo>
);
