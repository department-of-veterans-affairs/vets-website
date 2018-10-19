import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassificationInfo';
import {
  PtsdUploadChoiceDescription,
  UploadPtsdDescription,
} from '../content/ptsdUploadChoice';

export const uiSchema = {
  'ui:title': ({ formData }) => <PtsdNameTitle formData={formData} />,
  'ui:description': ({ formData }) => (
    <UploadPtsdDescription formData={formData} />
  ),
  'view:uploadPtsdChoice': {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions: 'I want to answer questions',
        upload: 'I want to upload VA Form 21-0781',
      },
    },
  },
  'view:uploadPtsdChoiceHelp': {
    'ui:description': PtsdUploadChoiceDescription,
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
