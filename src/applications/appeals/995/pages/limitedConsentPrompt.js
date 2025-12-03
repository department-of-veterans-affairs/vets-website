import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isOnReviewPage } from '../../shared/utils/helpers';
import { HAS_PRIVATE_LIMITATION } from '../constants';

export const promptQuestion =
  'Do you want to limit consent for the information requested?';

export default {
  uiSchema: {
    [HAS_PRIVATE_LIMITATION]: yesNoUI({
      title: promptQuestion,
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
      'ui:description': (
        <va-additional-info
          class="vads-u-margin-bottom--4"
          trigger="What does &quot;limiting consent&quot; mean?"
        >
          <p>
            If you choose to limit consent, your private provider, VA Vet
            Center, or medical facility can’t release certain types or amounts
            of information to us. For example, you want your doctor to release
            only information for certain treatment dates or health conditions.
          </p>
          <p>
            It may take us longer to get your medical records from a private
            provider or VA Vet Center if you limit consent.
          </p>
        </va-additional-info>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [HAS_PRIVATE_LIMITATION]: yesNoSchema,
      'view:evidenceLimitInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
