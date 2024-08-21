import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FormerSpouseHeader } from '../../../../components/SpouseViewField';

export const schema = {
  type: 'object',
  properties: {
    veteranMarriageHistory: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        properties: {
          endDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  veteranMarriageHistory: {
    items: {
      'ui:title': FormerSpouseHeader,
      endDate: {
        ...currentOrPastDateUI('When did the marriage end?'),
        'ui:required': formData => formData.veteranWasMarriedBefore,
      },
    },
  },
};
