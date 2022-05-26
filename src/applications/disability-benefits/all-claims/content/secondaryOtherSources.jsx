import React from 'react';
import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEventOnce } from 'platform/monitoring/record-event';
import { ANALYTICS_EVENTS, HELP_TEXT_CLICKED_EVENT } from '../constants';

export const otherSourcesDescription = (
  <div>
    <h3 className="vads-u-font-size--h5">Other sources of information</h3>
    <p>
      If you were treated at a military or private facility for this event, or
      reported the event to the authorities or anyone else, we can help you
      gather supporting information from them for your claim.
    </p>
    <p>
      If you have supporting (lay) statements from friends, family, or clergy,
      or have copies of reports from authorities, you’ll be able to upload those
      later in the application.
    </p>
  </div>
);

export const otherSourcesHelpText = (
  <VaAdditionalInfo
    trigger="Which should I choose"
    disableAnalytics
    onClick={() =>
      recordEventOnce(
        ANALYTICS_EVENTS.openedPtsd781aOtherSourcesHelp,
        HELP_TEXT_CLICKED_EVENT,
      )
    }
  >
    <h4 className="vads-u-font-size--h5">
      Choose "Yes" if you’d like help getting private medical treatment records
      or statements from military authorities
    </h4>
    <p>
      We can request statements or reports you made to military or civilian
      authorities about the event. We’ll need their name and contact information
      to request relevant documents on your behalf.
    </p>
    <p>
      You’ll need to give us permission to request your medical records from
      private health care providers and counselors. You’ll have a chance to do
      this later in the application.
    </p>
    <h4 className="vads-u-font-size--h5">
      Choose "No" if you don’t need help getting this evidence for your claim
    </h4>
    <p>You’ll have a chance to upload them later in the application.</p>
  </VaAdditionalInfo>
);
