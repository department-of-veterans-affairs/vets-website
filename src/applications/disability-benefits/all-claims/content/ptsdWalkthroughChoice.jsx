import React from 'react';

import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import { getPtsdClassification } from './ptsdClassification';

export const PtsdUploadChoiceDescription = ({ formType }) => (
  <AdditionalInfo triggerText="What does this mean?">
    <p>
      <strong>Answer questions:</strong> If you choose this option, we’ll ask
      you several questions about the events related to your PTSD. If you have
      evidence or documents to include, you will be able to upload that.
    </p>
    <p>
      <strong>Upload a form:</strong> If you choose to upload a completed VA
      Form
      {`21-0${formType}`}, you‘ll move to the next section of the disability
      application.
    </p>
  </AdditionalInfo>
);

const UploadExplanation = ({ formType }) => (
  <div>
    <p>
      You can either answer the questions online, or if you‘ve already completed
      a Claim for Service Connection for Post-Traumatic Stress Disorder (VA Form
      {`21-0${formType}`}
      ), you can upload the form.
    </p>
    <p>How would you like to provide information about your PTSD?</p>
  </div>
);

export const UploadPtsdDescription = ({ formData, formType }) => {
  const { incidentText } = getPtsdClassification(formData, formType);
  return (
    <div>
      <p>
        Now we‘re going to ask you questions about your
        {` ${incidentText}`}
        -related PTSD. All of the questions are optional, but any information
        you provide here will help us research your claim.
      </p>
      <UploadExplanation formType={formType} />
    </div>
  );
};

export const Ptsd781aUploadChoiceDescription = ({ formType }) => (
  <AdditionalInfo triggerText="What does this mean?">
    <p>
      <strong>Answer questions:</strong> If you choose this option, we‘ll ask
      you several questions about the events related to your PTSD. If you have
      evidence or documents to include, you will be able to upload that.
    </p>
    <p>
      <strong>Upload a form:</strong> If you choose to upload a completed
      {` 21-0${formType}`} form, you’ll move to the next section of the
      disability application.
    </p>
  </AdditionalInfo>
);

const Upload781aExplanation = ({ formType }) => (
  <div>
    <p>
      You can either answer the questions online, or if you‘ve already completed
      a Claim for Service Connection for Post-Traumatic Stress Disorder
      Secondary to Personal Assault (VA Form {`21-0${formType}`}
      ), you can upload the form.
    </p>
    <p>How would you like to provide information about your PTSD?</p>
  </div>
);

export const UploadPtsd781aDescription = ({ formData, formType }) => {
  const { incidentText } = getPtsdClassification(formData, formType);
  return (
    <div>
      <p>
        Now we‘re going to ask you questions about your
        {` ${incidentText}`}
        -related PTSD. All of the questions are optional, but any information
        you provide here will help us research your claim.
      </p>
      <Upload781aExplanation formType={formType} />
    </div>
  );
};
