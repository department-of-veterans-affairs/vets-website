import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Current marriage information',
    dateOfCurrentMarriage: currentOrPastDateUI('Date of marriage'),
  },
  schema: {
    type: 'object',
    required: ['dateOfCurrentMarriage'],
    properties: {
      dateOfCurrentMarriage: currentOrPastDateSchema,
    },
  },
};
