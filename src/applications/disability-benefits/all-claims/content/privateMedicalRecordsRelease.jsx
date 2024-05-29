import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEventOnce } from 'platform/monitoring/record-event';
import { ANALYTICS_EVENTS, HELP_TEXT_CLICKED_EVENT } from '../constants';

export const limitedConsentTitle =
  'I want to limit my consent for VA to retrieve only specific information from my private medical provider(s).';

export const limitedConsentTextTitle = (
  <p>Describe the limitation below (treatment dates, disability type, etc.).</p>
);

const { openedLimitedConsentHelp } = ANALYTICS_EVENTS;
export const limitedConsentDescription = (
  <VaAdditionalInfo
    trigger="What does this mean?"
    disableAnalytics
    onClick={() =>
      recordEventOnce(openedLimitedConsentHelp, HELP_TEXT_CLICKED_EVENT)
    }
  >
    <p>
      If you choose to limit consent, your doctor will follow the limitation you
      specify. Limiting consent could add to the time it takes to get your
      private medical records.
    </p>
  </VaAdditionalInfo>
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
