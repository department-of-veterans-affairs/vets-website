import React from 'react';

import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import { getPtsdClassification } from './ptsdClassification';

export const PtsdUploadChoiceDescription = (
  <AdditionalInfo triggerText="What does this mean?">
    <h5>Continue answering questions</h5>
    <p>
      If you choose to answer questions, we’ll ask you several questions to
      learn more about your PTSD.
    </p>
    <h5>Upload VA Form 21-0781</h5>
    <p>
      If you upload a completed VA Form 21-0781, we won’t ask you questions
      about your PTSD, and you’ll move to the next section of the disability
      application.
    </p>
  </AdditionalInfo>
);

const UploadExplanation = ({ formType }) => (
  <div>
    <p>
      If you have already completed a Claim for Service Connection for
      Post-Traumatic Stress Disorder (VA Form 21-0
      {`${formType}`}
      ), you can upload it here instead of answering the questions about your
      PTSD.
    </p>
    <p>How would you like to provide information about your PTSD?</p>
  </div>
);

export const UploadPtsdDescription = ({ formData, formType }) => {
  const { incidentText } = getPtsdClassification(formData);
  return (
    <div>
      <p>
        The following questions will help us understand more about your
        {` ${incidentText}`}
        -related PTSD. None of the questions we’ll ask you are required, but any
        information you provide here will help us research your claim.
      </p>
      <UploadExplanation formType={formType} />
    </div>
  );
};
