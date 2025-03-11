import {
  yesNoUI,
  yesNoSchema,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  expectedSeparationTypes,
  expectedSeparationLabels,
} from '../constants/benefits';

export default {
  uiSchema: {
    militaryServiceCurrentlyServing: yesNoUI({
      enableAnalytics: true,
      title: 'Are you currently serving in the military?',
      hint:
        'This includes active-duty service and service in the National Guard and Reserves.',
    }),
    expectedSeparation: {
      ...radioUI({
        enableAnalytics: true,
        title: 'When do you expect to separate or retire from the service?',
        labels: expectedSeparationLabels,
        required: () => false,
        hideIf: formData => formData.militaryServiceCurrentlyServing !== true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryServiceCurrentlyServing: yesNoSchema,
      expectedSeparation: radioSchema(Object.keys(expectedSeparationTypes)),
    },
  },
};
