import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  optionForMstTitle,
  optionForMstHint,
  supportInfo,
} from '../content/optionForMst';
import { MST_OPTION } from '../constants';

import { isOnReviewPage } from '../../shared/utils/helpers';

export default {
  uiSchema: {
    [MST_OPTION]: yesNoUI({
      title: optionForMstTitle,
      hint: optionForMstHint,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: false,
      updateUiSchema: () => ({
        'ui:options': {
          labelHeaderLevel: isOnReviewPage() ? 4 : 3,
        },
      }),
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
