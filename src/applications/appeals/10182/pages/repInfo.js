import {
  repLabel,
  repErrorMessage,
  repDescription,
} from '../content/representative';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:description': repDescription,
    'ui:options': {
      forceDivWrapper: true,
    },
    representativesName: {
      'ui:title': repLabel,
      'ui:required': formData => formData?.['view:hasRep'],
      'ui:errorMessages': {
        required: repErrorMessage,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      representativesName: {
        type: 'string',
        properties: {},
      },
    },
  },
};
