// import emailUiSchema from 'platform/forms-system/src/js/definitions/email';
// import { errorMessages } from '../constants';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    representative: {
      'ui:title': 'Please provide your representative’s contact information',
      name: {
        'ui:title': 'Representative’s name',
        'ui:required': formData => formData?.['view:hasRep'],
        'ui:errorMessages': {
          required: 'Please enter your representative’s full name',
        },
      },
      // email: emailUiSchema('Representative’s email'),
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
          // email: {
          //   type: 'string',
          // },
        },
      },
    },
  },
};
