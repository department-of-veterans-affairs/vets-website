import emailUI from 'platform/forms-system/src/js/definitions/email';
import {
  buildAddressSchema,
  addressUISchema,
} from 'applications/disability-benefits/686c-674/config/address-schema';
import { isVeteran } from '../../helpers';

const veteranAddress = buildAddressSchema(true);
// reset boolean type for checkbox
veteranAddress.properties['view:livesOnMilitaryBase'] = {
  type: 'boolean',
};

function validateEmailsMatch(errors, pageData) {
  const { email, confirmEmail } = pageData;
  if (email !== confirmEmail) {
    errors.confirmEmail.addError('Please ensure your entries match');
  }
}

export const schema = {
  type: 'object',
  properties: {
    veteranAddress,
    phone: {
      type: 'string',
      minLength: 10,
    },
    veteranEmailAddress: {
      type: 'string',
      minLength: 6,
      maxLength: 80,
    },
    veteranConfirmEmailAddress: {
      type: 'string',
      minLength: 6,
      maxLength: 80,
    },
  },
};

export const uiSchema = {
  'ui:validations': [validateEmailsMatch],
  veteranAddress: addressUISchema(true, 'veteranAddress', () => true),
  veteranPhone: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:required': formData => isVeteran(formData),
    'ui:title': 'Phone number',
    'ui:errorMessages': {
      pattern: 'Please enter only numbers, no dashes or parentheses',
    },
  },
  veteranEmailAddress: {
    ...emailUI(),
    'ui:required': () => true,
  },
  veteranConfirmEmailAddress: {
    ...emailUI(),
    'ui:title': 'Confirm email address',
    'ui:required': () => true,
    'ui:validations': [
      {
        validator: (errors, fieldData, formData) => {
          if (
            formData.veteranEmailAddress !== formData.veteranConfirmEmailAddress
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
