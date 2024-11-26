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
    militaryServiceTotalTimeServed: radioUI({
      enableAnalytics: true,
      title: 'In total, how long have you served in the military?',
      hint:
        'If you have served multiple periods, please choose the answer that reflects your total amount of service.',
      labels: militaryServiceTimeServedLabels,
      required: () => false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceTotalTimeServed: radioSchema(
        Object.keys(militaryServiceTimeServedTypes),
      ),
    },
  },
};
