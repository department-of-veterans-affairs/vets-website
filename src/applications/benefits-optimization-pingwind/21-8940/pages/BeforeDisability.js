import {
  textUI,
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns';

import { wrapDateRangeUiWithDl } from '../helpers/reviewHelpers';
import { changeDefaultDateHint } from '../helpers/hintChanger';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Education and Training Before Becoming Disabled'),
    'ui:description':
      'Tell us about your education or training before becoming too disabled to work.',

    otherBeforeEducation: yesNoUI({
      title:
        'Did you have any other education or training before you became too disabled to work?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
      useDlWrap: true,
      errorMessages: {
        required:
          'Select a response to tell us if you had education or training before becoming disabled.',
      },
    }),

    educationBeforeDisability: {
      'ui:options': {
        customTitle: 'Education before disability',
        useDlWrap: true,

        expandUnder: 'otherBeforeEducation',
        expandUnderCondition: true,
      },
      typeOfEducation: textUI({
        title: 'Type of education or training',
        useDlWrap: true,
        required: formData => formData.otherBeforeEducation === true,
        errorMessages: {
          required:
            'Tell us what kind of education or training you had before becoming disabled',
        },
      }),
      datesOfTraining: {
        ...wrapDateRangeUiWithDl(
          currentOrPastDateRangeUI(
            { title: 'Start date of training' },
            { title: 'End date of training' },
          ),
          { 'ui:description': changeDefaultDateHint },
        ),

        from: {
          ...wrapDateRangeUiWithDl(
            currentOrPastDateRangeUI(
              { title: 'Start date of training' },
              { title: 'End date of training' },
            ),
          ).from,
          'ui:required': formData => formData.otherBeforeEducation === true,
          'ui:description': changeDefaultDateHint,
          'ui:errorMessages': {
            required:
              'Enter the start date (month, day, and 4-digit year) of your education or training',
          },
        },
        to: {
          ...wrapDateRangeUiWithDl(
            currentOrPastDateRangeUI(
              { title: 'Start date of training' },
              { title: 'End date of training' },
            ),
          ).to,
          'ui:required': formData => formData.otherBeforeEducation === true,
          'ui:description': changeDefaultDateHint,
          'ui:errorMessages': {
            required:
              'Enter the end date (month, day, and 4-digit year) of your education or training',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherBeforeEducation: yesNoSchema,
      educationBeforeDisability: {
        type: 'object',
        properties: {
          typeOfEducation: {
            type: 'string',
            maxLength: 100,
          },
          // Overriding the individual dates required in the schema
          datesOfTraining: { ...currentOrPastDateRangeSchema, required: [] },
        },
      },
    },
    required: ['otherBeforeEducation'],
  },
};
