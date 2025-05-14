import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  militaryServiceTimeServedTypes,
  militaryServiceTimeServedLabels,
} from '../constants/benefits';

export default {
  uiSchema: {
    titleTenTimeServed: radioUI({
      enableAnalytics: true,
      title:
        'How long were you called up to active-duty (Title 10) orders while serving in the Reserve or National Guard?',
      hint:
        'This includes activations, deployments, and mobilizations under Title 10 orders.',
      labels: militaryServiceTimeServedLabels,
      required: () => false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      titleTenTimeServed: radioSchema(
        Object.keys(militaryServiceTimeServedTypes),
      ),
    },
  },
};
