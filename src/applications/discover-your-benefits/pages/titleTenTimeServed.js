import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { timeServedTypes, timeServedLabels } from '../constants/benefits';

export default {
  uiSchema: {
    titleTenTimeServed: radioUI({
      enableAnalytics: true,
      title:
        'How long were you called up to active-duty (Title 10) orders while serving in the National Guard or Reserves?',
      hint:
        'This includes activations, deployments, and mobilizations under Title 10 orders.',
      labels: timeServedLabels,
      required: () => false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleTenTimeServed: radioSchema(Object.keys(timeServedTypes)),
    },
  },
};
