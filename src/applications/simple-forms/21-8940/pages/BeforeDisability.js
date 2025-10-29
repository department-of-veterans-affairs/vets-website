import {
  radioUI,
  radioSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns/datePatterns';

import { EducationView } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Education and Training Before Becoming Disabled',
    'ui:description':
      'Tell us about your education and training before becoming too disabled to work.',

    otherEducation: yesNoUI({
      title:
        'Did you have any other education and training before you were too disabled to work?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),

    educationBeforeDisability: {
      'ui:options': {
        itemName: 'Education/Training',
        viewField: EducationView,
        customTitle: 'Education before disability',
        useDlWrap: true,
        keepInPageOnReview: true,
        /*showSave: true,
        reviewMode: true,*/
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
        typeOfEducation: {
          'ui:title': 'Type of education or training',
        },
        datesOfTraining: currentOrPastDateRangeUI(
          'Start date of training',
          'End date of training',
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
