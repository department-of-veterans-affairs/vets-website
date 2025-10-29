import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { DateRangeView } from '../components/viewElements';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Date(s) of Treatment(s)', 'Add all important treatment dates'),
    importantDates: {
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
      importantDates: {
        type: 'array',
        minItems: 1,
        maxItems: 2,
        items: {
          type: 'object',
          properties: {
            /*description: {
              type: 'string',
              maxLength: 100,
            },*/
            startDate: currentOrPastDateSchema,
            endDate: currentOrPastDateSchema,
          },
          required: ['startDate'],
        },
      },
    },
  },
};
