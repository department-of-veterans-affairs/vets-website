import React from 'react';
import { bddAlertBegin } from './common';

const alertContent = (
  <>
    {bddAlertBegin}
    <p>
      When you upload your Separation Health Assessment, select this for file
      type: <strong>Disability Benefits Questionnaire</strong>
    </p>
  </>
);

export const selfAssessmentHeadline =
  'Please submit your Separation Health Assessment - Part A Self-Assessment as soon as possible';

export const selfAssessmentAlert = () => {
  return (
    <>
      <va-alert status="warning" uswds>
        <h3 slot="headline">{selfAssessmentHeadline}</h3>
        {alertContent}
      </va-alert>
      <h3>Other documents or evidence</h3>
    </>
  );
};
