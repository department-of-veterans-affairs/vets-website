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


import { wrapDateRangeUiWithDl } from '../helpers/reviewHelpers';

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
      useDlWrap: true,
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
          'ui:required': formData => formData.otherBeforeEducation === true,
        },
        to: {
          ...wrapDateRangeUiWithDl(
            currentOrPastDateRangeUI(
              { title: 'Start date of training' },
              { title: 'End date of training' },
            ),
          ).to,
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
  },
};
