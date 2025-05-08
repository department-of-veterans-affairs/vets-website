import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';

export default {
  uiSchema: {
    ...titleUI('How did your marriage end?'),
    marriageEndReason: {
      'ui:title': ' ',
      'ui:webComponentField': VaRadioField,
      'ui:options': {
        labels: {
          DIVORCE: 'Divorce',
          ANNULMENT: 'Annulment',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageEndReason'],
    properties: {
      marriageEndReason: {
        type: 'string',
        enum: ['DIVORCE', 'ANNULMENT'],
      },
    },
  },
};
