import { genericSchemas } from '../../../generic-schema';
import emailUI from 'platform/forms-system/src/js/definitions/email';


export const schema = {
  type: 'object',
  required: [],
  properties: {
    countryDropdown: genericSchemas.countryDropdown,
    street: genericSchemas.genericTextinput,
    line2: genericSchemas.genericTextinput,
    line3: genericSchemas.genericTextinput,
    city: genericSchemas.genericTextinput,
    postalCode: genericSchemas.genericNumberInput,
    phoneNumber: genericSchemas.genericNumberInput,
    emailAddress: genericSchemas.genericTextinput,
  }
}

export const uiSchema = {
  countryDropdown: {
    'ui:title': 'Country',
    'ui:required': () => true,
  },
  street: {
    'ui:title': 'Street',
  },
  line2: {
    'ui:title': 'Line 2',
  },
  line3: {
    'ui:title': 'Line 3',
  },
  city: {
    'ui:title': 'City',
    'ui:required': () => true,
  },
  postalCode: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:required': () => true,
    'ui:title': 'Postal Code',
  },
  phoneNumber: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:required': () => true,
    'ui:title': 'Phone Number',
  },
  emailAddress: emailUI(),
}