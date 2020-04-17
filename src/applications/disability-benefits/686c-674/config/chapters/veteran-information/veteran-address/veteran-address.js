import { genericSchemas } from '../../../generic-schema';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import { buildAddressSchema, addressUISchema } from '../../../address-schema';

export const schema = {
  type: 'object',
  required: [],
  properties: {
    veteranAddress: buildAddressSchema(true),
    moreVeteranInformation: {
      type: 'object',
      properties: {
        phoneNumber: genericSchemas.phoneInput,
        emailAddress: genericSchemas.emailInput,
      },
    },
  },
};

export const uiSchema = {
  veteranAddress: addressUISchema(true, 'veteranAddress', () => true),
  moreVeteranInformation: {
    phoneNumber: {
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:required': () => true,
      'ui:title': 'Phone Number',
      'ui:errorMessages': {
        pattern: 'Please enter only numbers, no dashes or parentheses',
      },
    },
    emailAddress: emailUI(),
  },
};
