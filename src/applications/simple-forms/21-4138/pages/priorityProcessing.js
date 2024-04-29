import React from 'react';
import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { LIVING_SITUATIONS } from '../config/constants';
import { validateLivingSituation } from '../helpers';

/** @type {PageSchema} */
export const priorityProcessingIntroPage = {
  uiSchema: {
    ...titleUI(
      'What to know before you request priority processing',
      undefined,
      1,
      'vads-u-color--black',
    ),
    'view:priorityProcessingIntroContent': {
      'ui:description': (
        <div>
          <p>
            If you’re experiencing certain qualifying situations, we may be able
            to prioritize processing your claim. That means we’ll make a faster
            decision on your claim.
          </p>
          <p>
            First, we’ll ask you about your living situation. Then, we’ll ask
            you about other qualifying situations.
          </p>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:priorityProcessingIntroContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @type {PageSchema} */
export const priorityProcessingLivingSituationPage = {
  uiSchema: {
    livingSituation: checkboxGroupUI({
      title: 'Which of these statements best describes your living situation?',
      required: true,
      labels: LIVING_SITUATIONS,
      labelHeaderLevel: '1',
      tile: false,
      errorMessages: {
        required: 'Select the appropriate living situation',
      },
    }),
    'ui:validations': [validateLivingSituation],
  },
  schema: {
    type: 'object',
    properties: {
      livingSituation: checkboxGroupSchema(Object.keys(LIVING_SITUATIONS)),
    },
    required: ['livingSituation'],
  },
};
