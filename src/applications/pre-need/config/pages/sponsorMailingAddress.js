import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import * as address from '../../definitions/address';

export const uiSchema = {
  application: {
    veteran: {
      address: address.uiSchema('Sponsor’s address'),
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: {
            address: address.schema(fullSchemaPreNeed),
          },
        },
      },
    },
  },
};
