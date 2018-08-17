import { AlternateNameViewField } from '../content/alternateNames';

export const uiSchema = {
  'view:hasAlternateName': {
    'ui:title': 'Did you serve under another name?',
    'ui:widget': 'yesNo'
  },
  alternateNames: {
    'ui:title': 'Title goes here',
    'ui:description': 'What names did you serve under?',
    'ui:options': {
      viewField: AlternateNameViewField,
      expandUnder: 'view:hasAlternateName'
    },
    items: {
      firstName: {
        'ui:title': 'First name',
      },
      middleName: {
        'ui:title': 'Middle name',
      },
      lastName: {
        'ui:title': 'Last name',
      }
    }
  }
};

export const schema = {
  type: 'object',
  required: ['view:hasAlternateName'],
  properties: {
    'view:hasAlternateName': {
      type: 'boolean'
    },
    alternateNames: {
      type: 'array',
      minItems: 1,
      maxItems: 100,
      items: {
        type: 'object',
        required: ['firstName', 'lastName'],
        properties: {
          firstName: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          },
          middleName: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          },
          lastName: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          }
        }
      }
    }
  }
};
