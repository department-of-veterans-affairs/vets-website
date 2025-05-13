import {
  firstNameLastNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { MedallionsDescription } from '../components/MedallionsDescription';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Your name'),
    'ui:description': formContext => MedallionsDescription(formContext),
    firstLastName: {
      ...firstNameLastNameNoSuffixUI(),
      first: {
        'ui:title': 'First name',
        'ui:errorMessages': {
          required: 'Enter a first name',
        },
      },
      last: {
        'ui:title': 'Last name',
        'ui:errorMessages': {
          required: 'Enter a last name',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      firstLastName: {
        type: 'object',
        required: ['first', 'last'],
        properties: {
          first: {
            type: 'string',
            minLength: 1,
            maxLength: 15,
          },
          last: {
            type: 'string',
            minLength: 1,
            maxLength: 25,
          },
        },
      },
    },
    required: ['firstLastName'],
  },
};
