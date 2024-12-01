import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { showNewHlrContent } from '../utils/helpers';
import { homelessPageHeader } from '../content/homeless';

import {
  homelessTitle,
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
        title: homelessTitle,
        enableAnalytics: true,
        labelHeaderLevel: '3',
        labels: homelessLabels,
        updateUiSchema: formData => {
          const showNew = showNewHlrContent(formData);
          return {
            'ui:title': showNew ? homelessRiskTitle : homelessTitle,
            'ui:options': {
              labelHeaderLevel: showNew ? '' : '3',
            },
          };
        },
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
