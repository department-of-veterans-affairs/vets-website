import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { DateRangeView } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Date(s) of Hospitalization(s)',
      'Add all important treatment dates',
    ),
    importantHospitalDates: {
      'ui:options': {
        itemName: 'Date',
        viewField: DateRangeView,
        customTitle: 'Your important dates',
        useDlWrap: true,
        keepInPageOnReview: true,
        showSave: true,
        reviewMode: true,
        doNotScroll: true,
        confirmRemove: true,
        confirmRemoveDescription: 'Are you sure you want to remove this date?',
      },
      items: {
        'ui:options': {
          classNames: 'vads-u-margin-left--1p5',
        },
        /*description: {
          'ui:title': 'Description of this date',
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            hint: 'For example: "Date I was injured" or "Date of discharge"',
          },
        },*/
        startDate: currentOrPastDateUI('Start date'),
        endDate: {
          ...currentOrPastDateUI('End date (if applicable)'),
          'ui:required': () => false,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      importantHospitalDates: {
        type: 'array',
        minItems: 1,
        maxItems: 2,
        items: {
          type: 'object',
          properties: {
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
          },
          required: ['startDate'],
        },
      },
    },
  },
};
