import emailUI from 'platform/forms-system/src/js/definitions/email';

import { veteranContactInformation } from '../../../schemaImports';
import { addressUiSchema } from 'applications/vre/definitions/profileAddress';

const checkboxTitle =
  'I live on a United States military base outside of the U.S.';

export const schema = {
  type: 'object',
  properties: {
    ...veteranContactInformation.properties,
    'view:confirmEmail': {
      type: 'string',
    },
  },
  required: ['phoneNumber', 'email', 'view:confirmEmail'],
};

export const uiSchema = {
  veteranAddress: addressUiSchema('veteranAddress', checkboxTitle, () => true),
  phoneNumber: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:title': 'Phone number',
    'ui:errorMessages': {
      required: 'Please enter a valid phone number',
      pattern: 'Please enter only numbers, no dashes or parentheses',
    },
  },
  email: emailUI(),
  'view:confirmEmail': {
    ...emailUI(),
    'ui:title': 'Confirm email address',
    'ui:required': () => true,
    'ui:validations': [
      {
        validator: (errors, fieldData, formData) => {
          if (formData.email !== formData['view:confirmEmail']) {
            errors.addError(
              'This email does not match your previously entered email',
            );
          }
        },
      },
    ],
  },
};
