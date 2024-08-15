import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { optionForMstTitle, supportInfo } from '../content/optionForMst';

export default {
  uiSchema: {
    mstOption: yesNoUI({
      title: optionForMstTitle,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: false,
    }),

    'view:supportInfo': {
      'ui:description': supportInfo,
    },
  },
  schema: {
    type: 'object',
    properties: {
      mstOption: yesNoSchema,
      'view:supportInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
