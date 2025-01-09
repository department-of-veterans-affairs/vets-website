import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { giBillTypes, giBillTypeLabels } from '../constants/benefits';

export default {
  uiSchema: {
    giBillStatus: radioUI({
      enableAnalytics: true,
      title: 'Have you applied for and been awarded GI Bill benefits?',
      hint: `This includes the Post-9/11 GI Bill, Montgomery GI Bill Active Duty
          (MGIB-AD), and the Montgomery GI Bill Selected Reserve (MGIB-SR).`,
      labels: giBillTypeLabels,
      required: () => false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      giBillStatus: radioSchema(Object.keys(giBillTypes)),
    },
  },
};
