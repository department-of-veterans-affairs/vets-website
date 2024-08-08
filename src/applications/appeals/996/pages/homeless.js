import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { showNewHlrContent } from '../utils/helpers';
import { homelessPageHeader } from '../content/homeless';

import errorMessages from '../../shared/content/errorMessages';
import {
  homelessTitle,
  homelessRiskTitle,
  homelessLabels,
  homelessReviewField,
  homelessDescription,
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
        required: () => true,
        errorMessages: {
          required: errorMessages.requiredYesNo,
        },
        updateUiSchema: formData => {
          const showNew = showNewHlrContent(formData);
          return {
            'ui:title': showNew ? homelessRiskTitle : homelessTitle,
            'ui:options': {
              hint: showNew ? homelessDescription : '',
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
