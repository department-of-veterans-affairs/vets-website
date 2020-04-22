import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import get from 'platform/utilities/data/get';

const { alternateNames: alternateNamesSchema } = fullSchema.properties;

const hasAlternateName = formData =>
  get('view:hasAlternateName', formData, true);

export const uiSchema = {
  'view:hasAlternateName': {
    'ui:title': 'Have you served under a different name?',
    'ui:widget': 'yesNo',
  },
  alternateNames: {
    'ui:description': 'What name did you serve under?',
    'ui:options': {
      viewField: FullNameField,
      reviewTitle: 'Other names',
      expandUnder: 'view:hasAlternateName',
      itemName: 'Name',
    },
    items: {
      first: {
        'ui:title': 'First name',
        'ui:required': hasAlternateName,
      },
      middle: {
        'ui:title': 'Middle name',
      },
      last: {
        'ui:title': 'Last name',
        'ui:required': hasAlternateName,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:hasAlternateName': {
      type: 'boolean',
      properties: {},
    },
    alternateNames: alternateNamesSchema,
  },
};
