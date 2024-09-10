import {
  checkboxGroupSchema,
  checkboxGroupUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  livingSituationTitle,
  livingSituationChoices,
  livingSituationError,
  domesticViolenceInfo,
  livingSituationReviewField,
} from '../content/livingSituation';
import { livingSituationNone } from '../validations/livingSituation';

const labels = Object.keys(livingSituationChoices);

export default {
  uiSchema: {
    livingSituation: {
      ...checkboxGroupUI({
        title: livingSituationTitle,
        enableAnalytics: true,
        required: false,
        labelHeaderLevel: '3',
        labels: livingSituationChoices,
      }),
      'ui:validations': [livingSituationNone],
      'ui:errorMessages': {
        required: livingSituationError,
      },
      'ui:objectViewField': livingSituationReviewField,
    },
    'view:domesticViolenceInfo': {
      'ui:description': domesticViolenceInfo,
    },
  },
  schema: {
    type: 'object',
    properties: {
      livingSituation: checkboxGroupSchema(labels),
      'view:domesticViolenceInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
