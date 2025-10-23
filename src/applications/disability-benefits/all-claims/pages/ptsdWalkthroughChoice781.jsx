import React from 'react';

import { ptsd781NameTitle } from '../content/ptsdClassification';
import {
  PtsdUploadChoiceDescription,
  UploadPtsdDescription,
} from '../content/ptsdWalkthroughChoice';
import { PTSD_TYPES_TO_FORMS } from '../constants';

const { combatNonCombat } = PTSD_TYPES_TO_FORMS;
export const uiSchema = {
  'ui:title': ptsd781NameTitle,
  'ui:description': ({ formData }) => (
    <UploadPtsdDescription formData={formData} formType={combatNonCombat} />
  ),
  'view:upload781Choice': {
    'ui:title': 'How would you like to provide information about your PTSD?',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        answerQuestions:
          'I want to continue online and answer questions about my PTSD.',
        upload:
          ' I’ve already filled out VA Form 21-0781 and want to upload it.',
      },
    },
  },
  'view:upload781ChoiceHelp': {
    'ui:description': (
      <PtsdUploadChoiceDescription formType={combatNonCombat} />
    ),
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
