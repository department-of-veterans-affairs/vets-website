import emailUI from 'platform/forms-system/src/js/definitions/email';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import {
  claimantEmailAddress,
  claimantPhoneNumber,
  claimantAddress,
} from '../../utilities';

const checkboxTitle =
  'I live on a United States military base outside of the country.';

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
  claimantAddress: addressUiSchema(
    'claimantAddress',
    checkboxTitle,
    () => true,
  ),
  claimantPhoneNumber: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:required': () => true,
    'ui:title': 'Phone number',
    'ui:errorMessages': {
      pattern: 'Enter only numbers, no dashes or parentheses',
      required: 'Enter your phone number',
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
            formData.claimantEmailAddress.toLowerCase() !==
            formData.claimantConfirmEmailAddress.toLowerCase()
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
