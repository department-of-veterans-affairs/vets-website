import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { disabilityTypes, disabilityTypeLabels } from '../constants/benefits';

export default {
  uiSchema: {
    disabilityRating: radioUI({
      enableAnalytics: true,
      title: 'Do you have a VA disability rating?',
      labels: disabilityTypeLabels,
      required: () => false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      disabilityRating: radioSchema(Object.keys(disabilityTypes)),
    },
  },
};
