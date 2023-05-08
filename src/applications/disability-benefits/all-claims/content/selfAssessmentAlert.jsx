import React from 'react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { bddAlertBegin } from './common';

const alertContent = (
  <>
    {bddAlertBegin}
    <p>
      When you upload your Separation Health Assessment, select this for
      document type: <strong>Disability Benefits Questionaire</strong>
    </p>
  </>
);

export const selfAssessmentAlert = () => {
  return (
    !environment.isProduction() && (
      <>
        <va-alert status="warning">
          <h3 slot="headline">
            Please submit your Separation Health Assessment - Part A
            Self-Assessment as soon as possible
          </h3>
          {alertContent}
        </va-alert>
        <h3>Other documents or evidence</h3>
      </>
    )
  );
};
