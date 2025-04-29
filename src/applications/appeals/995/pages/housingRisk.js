import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { housingRiskTitle } from '../content/livingSituation';
import { UpdatedPagesAlert } from '../utils/toggle';

import { isOnReviewPage } from '../../shared/utils/helpers';

export default {
  uiSchema: {
    'view:housingRisk': {
      'ui:description': UpdatedPagesAlert,
    },
    housingRisk: yesNoUI({
      title: housingRiskTitle,
      classNames: 'vads-u-margin-bottom--4',
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      updateUiSchema: () => ({
        'ui:options': {
          labelHeaderLevel: isOnReviewPage() ? 4 : 3,
        },
      }),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:housingRisk': {
        type: 'object',
        properties: {},
      },
      housingRisk: yesNoSchema,
    },
  },
};
