import { maritalStatuses } from 'platform/static-data/options-for-select';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    maritalStatus: {
      'ui:title': 'Marital status',
    },
  },
  schema: {
    type: 'object',
    // required: ['gender', 'maritalStatus'],
    properties: {
      maritalStatus: {
        type: 'string',
        enum: maritalStatuses,
      },
    },
  },
};
