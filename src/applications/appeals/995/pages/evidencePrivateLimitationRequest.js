import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { content } from '../content/evidencePrivateLimitation';

import { isOnReviewPage } from '../../shared/utils/helpers';
import { EVIDENCE_LIMIT } from '../constants';

export default {
  uiSchema: {
    [EVIDENCE_LIMIT]: yesNoUI({
      title: content.ynTitle,
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
      [EVIDENCE_LIMIT]: yesNoSchema,
      'view:evidenceLimitInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
