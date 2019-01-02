import React from 'react';

import { ptsd781NameTitle } from '../content/ptsdClassification';
import {
  PtsdUploadChoiceDescription,
  UploadPtsdDescription,
} from '../content/ptsdWalkthroughChoice';

export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': ({ formData }) => (
    <UploadPtsdDescription formData={formData} formType="781" />
  ),
  'view:upload781Choice': {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions:
          'I want to continue online with questions about my PTSD.',
        upload:
          'I’ve already filled out a paper form (21-0781) and want to upload it.',
      },
    },
  },
  'view:upload781ChoiceHelp': {
    'ui:description': <PtsdUploadChoiceDescription formType="781" />,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:upload781Choice': {
      type: 'string',
      enum: ['answerQuestions', 'upload'],
    },
    'view:upload781ChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};
