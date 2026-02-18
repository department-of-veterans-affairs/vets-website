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
    ...titleUI('Education and Training After Becoming Disabled'),
    'ui:description':
      'Tell us about your education or training after becoming too disabled to work.',

    otherAfterEducation: yesNoUI({
      title:
        'Did you have any other education or training after you became too disabled to work?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
      useDlWrap: true,
      errorMessages: {
        required:
          'Select a response to tell us if you had education or training after becoming disabled.',
      },
    }),

    educationAfterDisability: {
      'ui:options': {
        customTitle: 'Education after disability',
        useDlWrap: true,

        expandUnder: 'otherAfterEducation',
        expandUnderCondition: true,
      },
      typeOfEducation: textUI({
        title: 'Type of education or training',
        useDlWrap: true,
        required: formData => formData.otherAfterEducation === true,
        errorMessages: {
          required:
            'Tell us what kind of education or training you had after becoming disabled',
        },
      }),
      datesOfTraining: {
        ...wrapDateRangeUiWithDl(
          currentOrPastDateRangeUI(
            { title: 'Start date of training' },
            { title: 'End date of training' },
          ),
        ),
        from: {
          ...wrapDateRangeUiWithDl(
            currentOrPastDateRangeUI(
              { title: 'Start date of training' },
              { title: 'End date of training' },
            ),
          ).from,
          'ui:required': formData => formData.otherAfterEducation === true,
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
          'ui:required': formData => formData.otherAfterEducation === true,
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
      otherAfterEducation: yesNoSchema,
      educationAfterDisability: {
        type: 'object',
        properties: {
          typeOfEducation: {
            type: 'string',
            maxLength: 100,
          },
          datesOfTraining: { ...currentOrPastDateRangeSchema, required: [] },
        },
      },
    },
    required: ['otherAfterEducation'],
  },
};
