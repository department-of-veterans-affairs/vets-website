import React from 'react';

import { ptsd781aNameTitle } from '../content/ptsdClassification';
import {
  PtsdUploadChoiceDescription,
  UploadPtsdDescription,
} from '../content/ptsdWalkthroughChoice';
import { PTSD_TYPES_TO_FORMS } from '../constants';

const { personalAssaultSexualTrauma } = PTSD_TYPES_TO_FORMS;
export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': ({ formData }) => (
    <UploadPtsdDescription
      formData={formData}
      formType={personalAssaultSexualTrauma}
    />
  ),
  'view:upload781aChoice': {
    'ui:title': 'How would you like to provide information about your PTSD?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions:
          'I want to continue online and answer questions about my PTSD.',
        upload:
          'I’ve already filled out VA Form 21-0781a and want to upload it.',
      },
    },
  },
  'view:upload781aChoiceHelp': {
    'ui:description': (
      <PtsdUploadChoiceDescription formType={personalAssaultSexualTrauma} />
    ),
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:upload781aChoice': {
      type: 'string',
      enum: ['answerQuestions', 'upload'],
    },
    'view:upload781aChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};
