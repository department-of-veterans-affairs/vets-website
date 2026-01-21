import {
  textUI,
  yesNoUI,
  yesNoSchema,
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
    'ui:title': 'Education and Training After Becoming Disabled',
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