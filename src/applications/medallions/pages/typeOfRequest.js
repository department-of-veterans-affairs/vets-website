import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Type of request'),
    typeOfRequestRadio: radioUI({
      title: 'Are you requesting a new medallion or a replacement medallion?',
      labels: {
        new: 'New medallion',
        replacement: 'Replacement medallion',
      },
      required: () => true,
      errorMessages: {
        required: 'Please select a response',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      typeOfRequestRadio: radioSchema(['new', 'replacement']),
    },
  },
};
