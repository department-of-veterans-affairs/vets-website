import fullSchema from 'vets-json-schema/dist/28-1900-schema.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { addressUISchema } from '../../../../../../disability-benefits/686c-674/config/address-schema';

const { veteranAddress, mainPhone, cellPhone, email } = fullSchema.properties;

export const schema = {
  type: 'object',
  properties: {
    veteranAddress,
    mainPhone,
    cellPhone,
    email,
    'view:confirmEmail': {
      type: 'string',
    },
  },
  required: ['email'],
};

export const uiSchema = {
  veteranAddress: addressUISchema(true, 'veteranAddress', () => true),
  mainPhone: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:title': 'Main phone number',
    'ui:errorMessages': {
      pattern: 'Please enter only numbers, no dashes or parentheses',
    },
  },
  cellPhone: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:title': 'Cell phone number',
    'ui:errorMessages': {
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
