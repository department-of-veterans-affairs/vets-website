import React from 'react';
import {
  ptsdNameTitle,
} from '../helpers';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

const uploadPtsdSecondaryDescription = () => {
  return (
    <div>
      <p>
        The following questions will help us understand more about your
        [PTSDclassification]-related PTSD. None of the questions we‘ll ask you are
        required, but any information you provide here will help us research your claim.
      </p>
      <p>
        If you have already completed a Claim for Service Connection for
        Post-Traumatic Stress Disorder (VA Form 21-0781), you can upload it here
        instead of answering the questions about your PTSD.
      </p>
      <p>How would you like to provide information about your PTSD?</p>
    </div>
  );
};

const ptsdChoiceSecondaryDescription = (
  <AdditionalInfo triggerText="What does this mean?">
    <h5>Continue answering questions</h5>
    <p>
      If you choose to answer questions, we‘ll ask you several questions to learn
      more about your PTSD.
    </p>
    <h5>Upload VA Form 21-0781a</h5>
    <p>
      If you upload a completed VA Form 21-0781a, we won‘t ask you questions about
      your PTSD, and you‘ll move to the next section of the disability application.
    </p>
  </AdditionalInfo>
);

export const uiSchema = {
  'ui:title': ptsdNameTitle,
  'view:uploadPtsdSecondaryChoice': {
    'ui:description': uploadPtsdSecondaryDescription,
    'ui:title': uploadPtsdSecondaryDescription,
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions: 'I want to answer questions',
        upload: 'I want to upload VA Form 21-0781a'
      }
    }
  },
  'view:uploadPtsdSecondaryChoiceHelp': {
    'ui:description': ptsdChoiceSecondaryDescription
  }
};

export const schema = {
  type: 'object',
  properties: {
    'view:uploadPtsdSecondaryChoice': {
      type: 'string',
      'enum': ['answerQuestions', 'upload']
    },
    'view:uploadPtsdSecondaryChoiceHelp': {
      type: 'object',
      properties: {}
    }
  }
};
