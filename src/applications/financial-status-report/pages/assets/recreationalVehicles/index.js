import { RecVehicleInfo } from './records';

export const uiSchema = {
  'ui:title': 'Your trailers, campers, and boats',
  questions: {
    hasRecreationalVehicle: {
      'ui:title':
        'What is the estimated value of your trailers, campers, and boats?',
      'ui:widget': 'text',
      'ui:required': () => true,
      'ui:errorMessages': {
        required:
          'Please enter the estimated value trailers, campers, and boats.',
      },
    },
  },
  'view:components': {
    'view:recVehicleInfo': {
      'ui:description': RecVehicleInfo,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasRecreationalVehicle: {
          type: 'string',
        },
      },
    },
    'view:components': {
      type: 'object',
      properties: {
        'view:recVehicleInfo': {
          type: 'object',
          properties: {},
        },
      },
    },
  },
};
