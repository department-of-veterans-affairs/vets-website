import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CONDITIONS_FIRST } from '../constants';
import { ServiceConnectedDisabilityDescription } from '../content/newConditions';
import { causeOptions } from './conditionByConditionPages/cause';
import { createItemName } from './conditionsFirstPages/utils';

/** @type {PageSchema} */
export default {
  title: formData => `Cause of ${createItemName(formData)}`,
  depends: formData => formData.demo === 'CONDITIONS_FIRST',
  path: `new-conditions-${CONDITIONS_FIRST}-follow-up-cause/:index`,
  showPagePerItem: true,
  arrayPath: 'conditionsFirst',
  uiSchema: {
    'ui:title': 'Conditions follow up - Cause',
    conditionsFirst: {
      items: {
        ...titleUI(({ formData }) => `Cause of ${createItemName(formData)}`),
        cause: radioUI({
          title: 'What caused your condition?',
          labels: causeOptions,
        }),
        'view:serviceConnectedDisabilityDescription': {
          'ui:description': ServiceConnectedDisabilityDescription,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      conditionsFirst: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            cause: radioSchema(Object.keys(causeOptions)),
            'view:serviceConnectedDisabilityDescription': {
              type: 'object',
              properties: {},
            },
          },
          required: ['cause'],
        },
      },
    },
  },
};
