import React from 'react';

import { VaAdditionalInfo } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEventOnce } from 'platform/monitoring/record-event';
import { getPtsdClassification } from './ptsdClassification';
import {
  ANALYTICS_EVENTS,
  HELP_TEXT_CLICKED_EVENT,
  PTSD_TYPES_TO_FORMS,
} from '../constants';

const { combatNonCombat, personalAssaultSexualTrauma } = PTSD_TYPES_TO_FORMS;

export const PtsdUploadChoiceDescription = ({ formType }) => {
  let ptsdWalkthroughEvent;
  if (formType === combatNonCombat) {
    ptsdWalkthroughEvent = ANALYTICS_EVENTS.openedPtsd781WalkthroughChoiceHelp;
  } else if (formType === personalAssaultSexualTrauma) {
    ptsdWalkthroughEvent = ANALYTICS_EVENTS.openedPtsd781aWalkthroughChoiceHelp;
  }

  return (
    <VaAdditionalInfo
      trigger="Which should I choose?"
      disableAnalytics
      onClick={() =>
        ptsdWalkthroughEvent &&
        recordEventOnce(ptsdWalkthroughEvent, HELP_TEXT_CLICKED_EVENT)
      }
    >
      <h3 className="vads-u-font-size--h5">Answer questions</h3>
      <p>
        If you choose this option, we’ll ask you several questions about the
        events related to your PTSD. If you have evidence or documents to
        include, you’ll be able to upload them later in the application.
      </p>
      <h3 className="vads-u-font-size--h5">Upload your completed form</h3>
      <p>
        If you choose to upload a completed VA Form {`21-0${formType}`}, you’ll
        move to the next section of the disability application.
      </p>
    </VaAdditionalInfo>
  );
};

const UploadExplanation = ({ formType }) => (
  <p>
    You can either answer the questions online, or if you’ve already completed a
    Claim for Service Connection for Post-Traumatic Stress Disorder{' '}
    {formType === personalAssaultSexualTrauma &&
      'Secondary to Personal Assault '}
    (VA Form {`21-0${formType}`}
    ), you can upload the form.
  </p>
);

export const UploadPtsdDescription = ({ formData, formType }) => {
  const { incidentText } = getPtsdClassification(formData, formType);
  return (
    <div>
      <p>
        Now we’re going to ask you questions about your
        {` ${incidentText}-related PTSD. `}
        All of the questions are optional, but any information you provide here
        will help us research your claim.
      </p>
      <UploadExplanation formType={formType} />
    </div>
  );
};
