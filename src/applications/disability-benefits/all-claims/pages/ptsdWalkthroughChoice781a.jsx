import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import {
  Ptsd781aUploadChoiceDescription,
  UploadPtsd781aDescription,
} from '../content/ptsdWalkthroughChoice';

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': ({ formData }) => (
    <UploadPtsd781aDescription formData={formData} formType="781a" />
  ),
  'view:uploadPtsdChoice': {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions:
          'I want to continue online with questions about my PTSD.',
        upload:
          'I‘ve already filled out a paper form (21-0781a) and want to upload it.',
      },
    },
  },
  'view:uploadPtsdChoiceHelp': {
    'ui:description': ({ formData }) => (
      <Ptsd781aUploadChoiceDescription formData={formData} formType="781a" />
    ),
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
