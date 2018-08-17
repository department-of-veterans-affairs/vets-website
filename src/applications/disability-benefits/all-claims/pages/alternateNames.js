import FullNameField from 'us-forms-system/lib/js/fields/FullNameField';

export const uiSchema = {
  'view:hasAlternateName': {
    'ui:title': 'Did you serve under another name?',
    'ui:widget': 'yesNo'
  },
  alternateNames: {
    'ui:description': 'What names did you serve under?',
    'ui:options': {
      viewField: FullNameField,
      reviewTitle: 'Other names',
      expandUnder: 'view:hasAlternateName'
    },
    items: {
      first: {
        'ui:title': 'First name',
      },
      middle: {
        'ui:title': 'Middle name',
      },
      last: {
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
        required: ['first', 'last'],
        properties: {
          first: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          },
          middle: {
            type: 'string',
            minLength: 1,
            maxLength: 30,
            pattern: "^([a-zA-Z0-9-/']+( ?))+$"
          },
          last: {
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
