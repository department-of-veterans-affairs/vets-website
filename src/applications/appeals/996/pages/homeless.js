import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { homelessPageHeader } from '../content/homeless';

import {
  homelessRiskTitle,
  homelessLabels,
  homelessReviewField,
} from '../../shared/content/homeless';

export default {
  uiSchema: {
    'ui:title': homelessPageHeader,
    'ui:options': {
      forceDivWrapper: true,
    },
    homeless: {
      ...yesNoUI({
        title: homelessRiskTitle,
        enableAnalytics: true,
        labels: homelessLabels,
      }),
      'ui:reviewField': homelessReviewField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      homeless: yesNoSchema,
    },
  },
};
