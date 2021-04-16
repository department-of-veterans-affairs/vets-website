import {
  repLabel,
  repErrorMessage,
  repDescription,
} from '../content/representative';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    representative: {
      'ui:title': ' ',
      'ui:description': repDescription,
      name: {
        'ui:title': repLabel,
        'ui:required': formData => formData?.['view:hasRep'],
        'ui:errorMessages': {
          required: repErrorMessage,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      representative: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      },
    },
  },
};
