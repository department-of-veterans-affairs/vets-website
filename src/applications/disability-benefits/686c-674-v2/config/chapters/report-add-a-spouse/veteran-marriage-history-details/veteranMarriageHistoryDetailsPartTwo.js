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
          startDate: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const uiSchema = {
  veteranMarriageHistory: {
    items: {
      'ui:title': FormerSpouseHeader,
      startDate: {
        ...currentOrPastDateUI('When did you get married?'),
        'ui:required': formData => formData.veteranWasMarriedBefore,
      },
    },
  },
};
