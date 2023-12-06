import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// test
/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Dates you were employed at ',
    employers: {
      items: {
        dateStart: currentOrPastDateUI('Start date of employment'),
        dateEnd: currentOrPastDateUI('End date of employment'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      employers: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            dateStart: currentOrPastDateSchema,
            dateEnd: currentOrPastDateSchema,
          },
          required: ['dateStart', 'dateEnd'],
        },
      },
    },
  },
};
