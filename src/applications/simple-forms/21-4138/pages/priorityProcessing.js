import React from 'react';
import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import VaTextareaField from '~/platform/forms-system/src/js/web-component-fields/VaTextareaField';
import {
  LIVING_SITUATIONS,
  ADDITIONAL_INFO_OTHER_HOUSING_RISKS,
  OTHER_REASONS_REQUIRED,
  OTHER_REASONS_OPTIONAL,
  PRIORITY_PROCESSING_NOT_QUALIFIED,
  PRIORITY_PROCESSING_QUALIFIED,
} from '../config/constants';
import { validateLivingSituation } from '../helpers';

/** @type {PageSchema} */
export const ppIntroPage = {
  uiSchema: {
    ...titleUI({
      title: 'What to know before you request priority processing',
      headerLevel: 1,
    }),
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
export const ppLivingSituationPage = {
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

/** @type {PageSchema} */
export const ppOtherHousingRisksPage = {
  uiSchema: {
    ...titleUI({ title: 'Other housing risks', headerLevel: 1 }),
    'view:additionalInfo': {
      'ui:description': ADDITIONAL_INFO_OTHER_HOUSING_RISKS,
    },
    otherHousingRisks: {
      'ui:title': 'Tell us about other housing risks you are experiencing',
      'ui:webComponentField': VaTextareaField,
      'ui:errorMessages': {
        required: 'List other housing risks you are experiencing',
      },
      'ui:options': {
        charcount: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:additionalInfo': {
        type: 'object',
        properties: {},
      },
      otherHousingRisks: {
        type: 'string',
        maxLength: 100,
      },
    },
    required: ['otherHousingRisks'],
  },
};

/** @type {PageSchema} */
export const ppOtherReasonsOptionalPage = {
  uiSchema: {
    otherReasons: checkboxGroupUI({
      title: 'Are any of these descriptions true for you?',
      hint: 'If not, select continue',
      required: false,
      labels: OTHER_REASONS_OPTIONAL,
      labelHeaderLevel: '1',
      tile: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      otherReasons: checkboxGroupSchema(Object.keys(OTHER_REASONS_OPTIONAL)),
    },
  },
};

/** @type {PageSchema} */
export const ppOtherReasonsRequiredPage = {
  uiSchema: {
    otherReasons: checkboxGroupUI({
      title: 'Which of these descriptions is true for you?',
      hint: 'Select all that apply.',
      required: true,
      labels: OTHER_REASONS_REQUIRED,
      labelHeaderLevel: '1',
      tile: false,
      errorMessages: {
        required: 'Select at least one description',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      otherReasons: checkboxGroupSchema(Object.keys(OTHER_REASONS_REQUIRED)),
    },
    required: ['otherReasons'],
  },
};

/** @type {PageSchema} */
export const ppNotQualifiedPage = {
  uiSchema: {
    ...titleUI({
      title: 'You may not qualify for priority processing',
      headerLevel: 1,
    }),
    'view:notQualified': {
      'ui:description': PRIORITY_PROCESSING_NOT_QUALIFIED,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:notQualified': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @type {PageSchema} */
export const ppQualifiedHandoffPage = {
  uiSchema: {
    ...titleUI({
      title: "There's a better way to request priority processing",
      headerLevel: 1,
    }),
    'view:priorityProcessingQualified': {
      'ui:description': PRIORITY_PROCESSING_QUALIFIED,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:priorityProcessingQualified': {
        type: 'object',
        properties: {},
      },
    },
  },
};
