import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { housingRiskTitle } from '../content/livingSituation';

import { isOnReviewPage } from '../../../shared/utils/helpers';

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
      housingRisk: yesNoSchema,
    },
  },
};
