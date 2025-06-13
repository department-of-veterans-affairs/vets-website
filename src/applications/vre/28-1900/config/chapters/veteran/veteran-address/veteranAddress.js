import fullSchema from 'vets-json-schema/dist/28-1900_V2-schema.json';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';

import { VeteranAddressDescription } from '../../../../components/VeteranAddressDescription';
import updateAddressUiSchema from '../../../../utils/updateAddressSchema';

const { veteranAddress, mainPhone, cellPhone, email } = fullSchema.properties;

const checkboxTitle =
  'I live on a United States military base outside of the U.S.';

export const schema = {
  type: 'object',
  properties: {
    'view:addressDescription': {
      type: 'object',
      properties: {},
    },
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
const originalVeteranAddressUiSchema = addressUiSchema(
  'veteranAddress',
  checkboxTitle,
  () => true,
);
const veteranAddressUiSchema = updateAddressUiSchema(
  originalVeteranAddressUiSchema,
);

export const uiSchema = {
  'view:addressDescription': {
    'ui:description': VeteranAddressDescription,
  },
  veteranAddress: veteranAddressUiSchema,
  mainPhone: {
    'ui:required': () => true,
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
    },
    'ui:title': 'Main phone number',
    'ui:errorMessages': {
      pattern: 'Enter only numbers, no dashes or parentheses',
    },
  },
  cellPhone: {
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hideEmptyValueInReview: true,
    },
    'ui:title': 'Cell phone number',
    'ui:errorMessages': {
      pattern: 'Enter only numbers, no dashes or parentheses',
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
          if (
            formData.email.toLowerCase() !==
            formData['view:confirmEmail'].toLowerCase()
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
