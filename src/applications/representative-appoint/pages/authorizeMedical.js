import {
  authorizationInfo,
  authorizationNote,
} from '../content/authorizationInfo';

export default {
  uiSchema: {
    'view:authorizationInfo': {
      'ui:description': authorizationInfo,
    },
    authorizationRadio: {
      'ui:title': `Do you authorize this accredited VSO to access your medical records?`,
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          'First option': { 'data-info': 'first_1' },
          'Second option': { 'data-info': 'second_2' },
        },
        selectedProps: {
          'First option': { 'aria-describedby': 'some_id_1' },
          'Second option': { 'aria-describedby': 'some_id_2' },
        },
      },
    },

    'view:authorizationNote': {
      'ui:description': authorizationNote,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:authorizationInfo': {
        type: 'object',
        properties: {},
      },
      authorizationRadio: {
        type: 'string',
        enum: [
          'Yes, they can access all of these types of records',
          'Yes, but they can only access some of these types of records',
          `No, they can't access any of these types of records`,
        ],
      },
      'view:authorizationNote': {
        type: 'object',
        properties: {},
      },
    },
  },
};
