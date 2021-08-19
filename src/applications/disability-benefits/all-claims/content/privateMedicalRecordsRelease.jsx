import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import { recordEventOnce } from 'platform/monitoring/record-event';
import { ANALYTICS_EVENTS, HELP_TEXT_CLICKED_EVENT } from '../constants';

export const limitedConsentTitle = (
  <p>
    I want to limit my consent for VA to retrieve only specific information from
    my private medical provider(s).
  </p>
);

export const limitedConsentTextTitle = (
  <p>Describe the limitation below (treatment dates, disability type, etc.).</p>
);

const { openedLimitedConsentHelp } = ANALYTICS_EVENTS;
export const limitedConsentDescription = (
  <AdditionalInfo
    triggerText="What does this mean?"
    onClick={() =>
      recordEventOnce(openedLimitedConsentHelp, HELP_TEXT_CLICKED_EVENT)
    }
  >
    <p>
      If you choose to limit consent, your doctor will follow the limitation you
      specify. Limiting consent could add to the time it takes to get your
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
