import React from 'react';

import {
  textUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns';

import { HideDefaultDateHint } from '../helpers/dateHint';
import { wrapDateRangeUiWithDl } from '../helpers/reviewHelpers';

const trainingDateRangeUI = (() => {
  const dateRange = wrapDateRangeUiWithDl(
    currentOrPastDateRangeUI(
      { title: 'Start date of training', hint: 'For example: January 19 2022' },
      { title: 'End date of training', hint: 'For example: January 19 2022' },
    ),
  );

  return {
    ...dateRange,
    from: {
      ...dateRange.from,
      'ui:description': HideDefaultDateHint,
    },
    to: {
      ...dateRange.to,
      'ui:description': HideDefaultDateHint,
    },
  };
})();

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': (
      <h3 className="vads-u-font-size--h3 vads-u-margin-bottom--0">
        Education and Training Before Becoming Disabled
      </h3>
    ),
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
      }),
      datesOfTraining: {
        ...trainingDateRangeUI,

        from: {
          ...trainingDateRangeUI.from,
          'ui:required': formData => formData.otherBeforeEducation === true,
        },
        to: {
          ...trainingDateRangeUI.to,
          'ui:required': formData => formData.otherBeforeEducation === true,
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
