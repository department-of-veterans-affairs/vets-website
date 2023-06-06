// In a real app this would not be imported directly; instead the schema that
// is imported from vets-json-schema should include these common definitions:
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import * as address from 'platform/forms-system/src/js/definitions/address';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

// once the form schema is added to vets-json-schema, import this from there
// and remove this duplicate
import fullSchema from '../00-1234-schema.json';

const { usaPhone } = commonDefinitions;

const contactInformation = {
  uiSchema: {
    address: address.uiSchema('Mailing address'),
    email: {
      'ui:title': 'Primary email',
    },
    altEmail: {
      'ui:title': 'Secondary email',
    },
    phoneNumber: phoneUI('Daytime phone'),
  },
  schema: {
    type: 'object',
    properties: {
      address: address.schema(fullSchema, true),
      email: {
        type: 'string',
        format: 'email',
      },
      altEmail: {
        type: 'string',
        format: 'email',
      },
      phoneNumber: usaPhone,
    },
  },
};

export default contactInformation;
