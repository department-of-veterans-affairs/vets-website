import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CONDITIONS_FIRST } from '../constants';
import { ServiceConnectedDisabilityDescription } from '../content/newConditions';
import {
  causeOptions,
  getCauseOptions,
} from './conditionByConditionPages/cause';
import { createItemName } from './conditionsFirstPages/utils';

const hasOtherConditions = (formData, currentIndex) =>
  formData?.conditionsFirst
    ?.filter((_, index) => index !== currentIndex)
    ?.map(item => createItemName(item)).length;

// TODO: Get index from path
const getUIOptions = formData => {
  const includeSecondary = hasOtherConditions(formData, 0);

  return {
    'ui:options': {
      labels: getCauseOptions(includeSecondary),
    },
  };
};

// TODO: Get index from path
const getSchemaOptions = formData => {
  const includeSecondary = hasOtherConditions(formData, 0);

  return radioSchema(Object.keys(getCauseOptions(includeSecondary)));
};

/** @type {PageSchema} */
export default {
  title: formData => createItemName(formData, true),
  depends: formData => formData.demo === 'CONDITIONS_FIRST',
  path: `new-conditions-${CONDITIONS_FIRST}-follow-up-cause/:index`,
  showPagePerItem: true,
  arrayPath: 'conditionsFirst',
  uiSchema: {
    'ui:title': 'Conditions follow up - Cause',
    conditionsFirst: {
      items: {
        ...titleUI(({ formData }) => createItemName(formData, true)),
        cause: radioUI({
          title: 'What caused your condition?',
          labels: causeOptions,
          updateUiSchema: formData => getUIOptions(formData),
          updateSchema: formData => getSchemaOptions(formData),
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
