import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import countries from 'platform/user/profile/vap-svc/constants/countries.json';

export const uiSchema = {
  country: {
    'ui:title': 'What country do you live in?',
    'ui:webComponentField': VaSelectField,
  },
};

export const schema = {
  type: 'object',
  required: ['country'],
  properties: {
    country: {
      type: 'string',
      enum: countries.map(country => country.countryName),
    },
  },
};
