import FullNameField from 'us-forms-system/lib/js/fields/FullNameField';
import fullSchema from '../config/schema';

const { alternateNames: alternateNamesSchema } = fullSchema.properties;

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
      expandUnder: 'view:hasAlternateName',
      addAnotherLabel: 'Add another name'
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
  properties: {
    'view:hasAlternateName': {
      type: 'object',
      properties: {}
    },
    alternateNames: alternateNamesSchema
  }
};
