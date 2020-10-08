import emailUI from 'platform/forms-system/src/js/definitions/email';
// import {
//   buildAddressSchema,
//   addressUISchema,
// } from 'applications/disability-benefits/686c-674/config/address-schema';
import {
  addressSchema,
  addressUiSchema,
} from 'applications/vre/definitions/profileAddress';
import { claimantEmailAddress, claimantPhoneNumber } from '../../utilities';

// const claimantAddress = buildAddressSchema(true);
// reset boolean type for checkbox
// claimantAddress.properties['view:livesOnMilitaryBase'] = {
//   type: 'boolean',
// };

const claimantAddress = addressSchema;
const checkboxTitle =
  'I live on a United States military base outside of the U.S.';

export const schema = {
  type: 'object',
  properties: {
    claimantAddress,
    claimantPhoneNumber,
    claimantEmailAddress,
    claimantConfirmEmailAddress: claimantEmailAddress,
  },
};

export const uiSchema = {
  // Need to overwrite the default title brought over from addressUISchema() because it defaults to "They live..."
  claimantAddress: addressUiSchema(
    'claimantAddress',
    checkboxTitle,
    () => true,
  ),
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
            formData.claimantEmailAddress !==
            formData.claimantConfirmEmailAddress
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
