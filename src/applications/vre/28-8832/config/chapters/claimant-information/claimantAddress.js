import emailUI from 'platform/forms-system/src/js/definitions/email';
import {
  buildAddressSchema,
  addressUISchema,
} from 'applications/disability-benefits/686c-674/config/address-schema';

const claimantAddress = buildAddressSchema(true);
// reset boolean type for checkbox
claimantAddress.properties['view:livesOnMilitaryBase'] = {
  type: 'boolean',
};

export const schema = {
  type: 'object',
  properties: {
    claimantAddress,
    claimantPhoneNumber: {
      type: 'string',
      minLength: 7,
      maxLength: 10,
    },
    claimantEmailAddress: {
      type: 'string',
      minLength: 6,
      maxLength: 80,
    },
    claimantConfirmEmailAddress: {
      type: 'string',
      minLength: 6,
      maxLength: 80,
    },
  },
};

export const uiSchema = {
  claimantAddress: addressUISchema(true, 'dependentAddress', () => true),
  claimantPhoneNumber: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:title': 'Phone number',
    'ui:errorMessages': {
      pattern: 'Please enter only numbers, no dashes or parentheses',
    },
  },
  claimantEmailAddress: {
    ...emailUI(),
    'ui:required': () => true,
  },
  claimantConfirmEmailAddress: {
    ...emailUI(),
    'ui:title': 'Confirm email address',
    'ui:required': () => true,
    'ui:validations': [
      {
        validator: (errors, fieldData, formData) => {
          if (
            formData.dependentEmailAddress !==
            formData.dependentConfirmEmailAddress
          ) {
            errors.addError(
              'This email does not match your previously entered email',
            );
          }
        },
      },
    ],
  },
};
