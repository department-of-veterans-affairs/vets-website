import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from '../26-4555-schema.json';

const livingSituation2 = {
  uiSchema: {
    careFacilityName: {
      'ui:title':
        'What is the name of the nursing home or medical care facility?',
    },
    careFacilityAddress: address.uiSchema(
      'What is the address of the nursing home or medical care facility you are living in?',
    ),
  },
  schema: {
    type: 'object',
    required: ['careFacilityAddress'],
    properties: {
      careFacilityName: {
        type: 'string',
      },
      careFacilityAddress: address.schema(fullSchema, true),
    },
  },
};

export default livingSituation2;
