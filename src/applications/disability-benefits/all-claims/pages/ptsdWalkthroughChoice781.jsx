import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import {
  PtsdUploadChoiceDescription,
  UploadPtsdDescription,
} from '../content/ptsdWalkthroughChoice';

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781" />
  ),
  'ui:description': ({ formData }) => (
    <UploadPtsdDescription formData={formData} formType="781" />
  ),
  'view:uploadPtsdChoice': {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions:
          'I want to continue online with questions about my PTSD.',
        upload:
          'I‘ve already filled out a paper form (21-0781) and want to upload it.',
      },
    },
  },
  'view:uploadPtsdChoiceHelp': {
    'ui:description': <PtsdUploadChoiceDescription formType="781" />,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:uploadPtsdChoice': {
      type: 'string',
      enum: ['answerQuestions', 'upload'],
    },
    'view:uploadPtsdChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};
