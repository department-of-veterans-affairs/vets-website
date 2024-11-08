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
      title: 'Are you currently serving in the military?',
      hint:
        'This includes active-duty service, and service in the National Gaurd and Reserve.',
    }),
    expectedSeparation: {
      ...radioUI({
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
