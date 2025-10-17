import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { content } from '../content/limitedConsent';
import { isOnReviewPage } from '../../shared/utils/helpers';
import { LIMITED_CONSENT_RESPONSE } from '../constants';

export default {
  uiSchema: {
    [LIMITED_CONSENT_RESPONSE]: yesNoUI({
      title: content.promptQuestion,
      enableAnalytics: true,
      labelHeaderLevel: '3',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      hideOnReview: true,
      updateUiSchema: () => ({
        'ui:options': {
          labelHeaderLevel: isOnReviewPage() ? 4 : 3,
        },
      }),
    }),
    'view:evidenceLimitInfo': {
      'ui:description': content.info,
    },
  },
  schema: {
    type: 'object',
    properties: {
      [LIMITED_CONSENT_RESPONSE]: yesNoSchema,
      'view:evidenceLimitInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
