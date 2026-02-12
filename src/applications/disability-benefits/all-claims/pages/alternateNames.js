import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import get from 'platform/utilities/data/get';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const { alternateNames: alternateNamesSchema } = fullSchema.properties;

const hasAlternateName = formData =>
  get('view:hasAlternateName', formData, true);

export const uiSchema = {
  'view:hasAlternateName': yesNoUI({
    title: 'Have you served under a different name?',
  }),
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
        'ui:autocomplete': 'given-name',
        'ui:required': hasAlternateName,
        'ui:errorMessages': {
          pattern:
            "Name may only contain letters, numbers, spaces, and these special characters: - / '",
        },
      },
      middle: {
        'ui:title': 'Middle name',
        'ui:autocomplete': 'additional-name',
        'ui:errorMessages': {
          pattern:
            "Name may only contain letters, numbers, spaces, and these special characters: - / '",
        },
      },
      last: {
        'ui:title': 'Last name',
        'ui:autocomplete': 'family-name',
        'ui:required': hasAlternateName,
        'ui:errorMessages': {
          pattern:
            "Name may only contain letters, numbers, spaces, and these special characters: - / '",
        },
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:hasAlternateName': yesNoSchema,
    alternateNames: alternateNamesSchema,
  },
};
