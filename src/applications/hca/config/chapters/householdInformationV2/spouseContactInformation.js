import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';

const { spousePhone } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:title': 'Spouse\u2019s address and phone number',
    spouseAddress: {
      ...addressUI(null, true),
      street: {
        'ui:title': 'Street address',
        'ui:errorMessages': {
          pattern:
            'Please provide a valid street. Must be at least 1 character.',
        },
      },
      city: {
        'ui:errorMessages': {
          pattern: 'Please provide a valid city. Must be at least 1 character.',
        },
      },
    },
    spousePhone: phoneUI(),
  },
  schema: {
    type: 'object',
    properties: {
      spouseAddress: addressSchema(fullSchemaHca, true),
      spousePhone,
    },
  },
};
