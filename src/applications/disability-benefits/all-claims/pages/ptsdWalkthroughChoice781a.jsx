import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';
import {
  PtsdUploadChoiceDescription,
  UploadPtsdDescription,
} from '../content/ptsdWalkthroughChoice';

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': ({ formData }) => (
    <UploadPtsdDescription formData={formData} formType="781a" />
  ),
  'view:upload781aChoice': {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions: 'I want to answer questions',
        upload: 'I want to upload VA Form 21-0781a',
      },
    },
  },
  'view:upload781aChoiceHelp': {
    'ui:description': <PtsdUploadChoiceDescription formType="781a" />,
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
