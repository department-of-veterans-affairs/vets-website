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

import { EducationView } from '../components/viewElements';
import SafeArrayField from '../components/SafeArrayField';
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
      'Tell us about your education and training before becoming too disabled to work.',

    otherEducation: yesNoUI({
      title:
        'Did you have any other education and training before you were too disabled to work?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      useDlWrap: true,
    }),

    educationBeforeDisability: {
      'ui:field': SafeArrayField,
      'ui:options': {
        itemName: 'Education/Training',
        viewField: EducationView,
        customTitle: 'Education before disability',
        useDlWrap: true,
        keepInPageOnReview: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription:
          'Are you sure you want to remove this education/training?',
        addAnotherText: 'Add another education/training',
        hideIf: formData => formData.otherEducation !== true,
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        typeOfEducation: textUI({
          title: 'Type of education or training',
          useDlWrap: true,
        }),
        datesOfTraining: wrapDateRangeUiWithDl(
          currentOrPastDateRangeUI(
            { title: 'Start date of training' },
            { title: 'End date of training' },
          ),
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherEducation: yesNoSchema,
      educationBeforeDisability: {
        type: 'array',
        minItems: 0,
        maxItems: 1,
        items: {
          type: 'object',
          properties: {
            typeOfEducation: {
              type: 'string',
              maxLength: 100,
            },
            datesOfTraining: currentOrPastDateRangeSchema,
          },
          required: ['typeOfEducation', 'datesOfTraining'],
        },
      },
    },
  },
};
