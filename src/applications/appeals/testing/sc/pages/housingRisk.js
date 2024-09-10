import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { housingRiskTitle } from '../content/livingSituation';

export default {
  uiSchema: {
    housingRisk: yesNoUI({
      title: housingRiskTitle,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      housingRisk: yesNoSchema,
    },
  },
};
