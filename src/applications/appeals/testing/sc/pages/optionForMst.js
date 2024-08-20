import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { optionForMstTitle, supportInfo } from '../content/optionForMst';
import { MST_OPTION } from '../constants';

export default {
  uiSchema: {
    [MST_OPTION]: yesNoUI({
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
      [MST_OPTION]: yesNoSchema,
      'view:supportInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
