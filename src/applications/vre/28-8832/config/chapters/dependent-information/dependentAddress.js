import emailUI from 'platform/forms-system/src/js/definitions/email';
import {
  buildAddressSchema,
  addressUISchema,
} from 'applications/disability-benefits/686c-674/config/address-schema';

const dependentAddress = buildAddressSchema(true);
// reset boolean type for checkbox
dependentAddress.properties['view:livesOnMilitaryBase'] = {
  type: 'boolean',
};

export const schema = {
  type: 'object',
  properties: {
    dependentAddress,
    phoneNumber: {
      type: 'string',
      minLength: 7,
      maxLength: 10,
    },
    emailAddress: {
      type: 'string',
      minLength: 6,
      maxLength: 80,
    },
  },
};

export const uiSchema = {
  dependentAddress: addressUISchema(true, 'dependentAddress', () => true),
  phoneNumber: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:title': 'Phone number',
    'ui:errorMessages': {
      pattern: 'Please enter only numbers, no dashes or parentheses',
    },
  },
  emailAddress: emailUI(),
};
