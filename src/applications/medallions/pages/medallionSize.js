import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Size of medallion'),
    medallionSizeRadio: radioUI({
      title: 'What size medallion would you like?',
      labels: {
        small: 'Small (1.5 inches)',
        medium: 'Medium (3 inches)',
        large: 'Large (4 inches)',
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
      medallionSizeRadio: radioSchema(['small', 'medium', 'large']),
    },
  },
};
