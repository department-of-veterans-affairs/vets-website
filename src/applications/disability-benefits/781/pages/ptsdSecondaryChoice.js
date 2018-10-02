import React from 'react';
import {
  PtsdNameTitle781,
  UploadPtsdDescription781,
  ptsdChoiceDescription,
} from '../helpers';

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle781 formData={formData} formType="781a"/>
  ),
  'ui:description': ({ formData }) => (
    <UploadPtsdDescription781 formData={formData} formType="781a"/>
  ),
  'view:uploadPtsdSecondaryChoice': {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions: 'I want to answer questions',
        upload: 'I want to upload VA Form 21-0781a',
      },
    },
  },
  'view:uploadPtsdSecondaryChoiceHelp': {
    'ui:description': ptsdChoiceDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:uploadPtsdSecondaryChoice': {
      type: 'string',
      'enum': ['answerQuestions', 'upload'],
    },
    'view:uploadPtsdSecondaryChoiceHelp': {
      type: 'object',
      properties: {},
    },
  },
};
