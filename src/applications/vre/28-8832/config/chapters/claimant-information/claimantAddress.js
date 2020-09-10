import emailUI from 'platform/forms-system/src/js/definitions/email';
import {
  buildAddressSchema,
  addressUISchema,
} from 'applications/disability-benefits/686c-674/config/address-schema';
import { claimantEmailAddress, claimantPhoneNumber } from '../../utilities';

const claimantAddress = buildAddressSchema(true);
// reset boolean type for checkbox
claimantAddress.properties['view:livesOnMilitaryBase'] = {
  type: 'boolean',
};

export const schema = {
  type: 'object',
  properties: {
    claimantAddress,
    claimantPhoneNumber,
    claimantEmailAddress,
    'view:claimantConfirmEmailAddress': claimantEmailAddress,
  },
};

export const uiSchema = {
  claimantAddress: addressUISchema(true, 'claimantAddress', () => true),
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
  'view:claimantConfirmEmailAddress': {
    ...emailUI(),
    'ui:title': 'Confirm email address',
    'ui:required': () => true,
    'ui:validations': [
      {
        validator: (errors, fieldData, formData) => {
          if (
            formData.claimantEmailAddress !==
            formData['view:claimantConfirmEmailAddress']
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
