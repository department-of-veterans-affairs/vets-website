import {
  authorizeMedical,
  authorizationNote,
} from '../content/authorizeMedical';
import { saveYourApplication } from '../content/saveYourApplication';

export default {
  uiSchema: {
    'view:saveYourApplication': {
      'ui:description': saveYourApplication,
    },
    'view:authorizeMedical': {
      'ui:description': authorizeMedical,
    },
    authorizationRadio: {
      'ui:title': `Do you authorize this accredited VSO to access your medical records?`,
      'ui:widget': 'radio',
      'ui:options': {
        widgetProps: {
          'All records': { 'data-info': 'all_records' },
          'Some records': { 'data-info': 'some_records' },
          'No records': { 'data-info': 'no_records' },
        },
        selectedProps: {
          'All records': { 'aria-describedby': 'all_records' },
          'Some records': { 'aria-describedby': 'some_records' },
          'No records': { 'aria-describedby': 'no_records' },
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
      'view:saveYourApplication': {
        type: 'object',
        properties: {},
      },
      'view:authorizeMedical': {
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
