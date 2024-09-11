import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { DependentDeceasedWhenH3 } from './helpers';

export const schema = {
  type: 'object',
  properties: {
    deaths: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          dependentDeathDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  deaths: {
    items: {
      'ui:title': DependentDeceasedWhenH3,
      dependentDeathDate: currentOrPastDateUI({
        title: 'Date of death',
        required: () => true,
      }),
    },
  },
};
