import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const limitedConsentTitle = (
  <p>
    I want to limit my consent for the VA to retrieve only specific information
    from my private medical provider(s).
  </p>
);

export const limitedConsentTextTitle = (
  <p>Describe the limitation below. (Treatment dates, Disability type, etc.)</p>
);

export const limitedConsentDescription = (
  <AdditionalInfo triggerText="What does this mean?">
    <p>
      If you choose to limit consent, your doctor will abide by the limitation
      you specify. Limiting consent could add to the time it takes to get your
      private medical records.
    </p>
  </AdditionalInfo>
);

export const recordReleaseDescription = () => (
  <div>
    <p>
      Please let us know where and when you received treatment. We’ll request
      your private medical records for you. If you have records available, you
      can upload them later in the application.
    </p>
  </div>
);
