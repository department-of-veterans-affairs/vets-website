import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import {
  currentOrPastDateUI as currentOrPastDateUIWC,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-schemas/dateSchemas';

/** @type {PageSchema} */
export default {
  uiSchema: {
    dateDefault: currentOrPastDateUI('Date of birth - default'),
    dateWC: currentOrPastDateUIWC('Date of birth - web component'),
  },
  schema: {
    type: 'object',
    properties: {
      dateDefault: {
        $ref: '#/definitions/date',
      },
      dateWC: currentOrPastDateSchema(),
    },
    required: ['dateWC', 'dateDefault'],
  },
};
