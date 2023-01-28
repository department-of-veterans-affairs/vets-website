import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from '../26-4555-schema.json';

const contactInformation1 = {
  uiSchema: {
    address: address.uiSchema('Mailing address'),
  },
  schema: {
    type: 'object',
    properties: {
      address: address.schema(fullSchema, true),
    },
  },
};

export default contactInformation1;
