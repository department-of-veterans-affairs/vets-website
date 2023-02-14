import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from '../26-4555-schema.json';

const previousSahApplication2 = {
  uiSchema: {
    previousSahApplicationDate: {
      'ui:title': 'Date of application',
      'ui:widget': 'date',
    },
    previousSahApplicationAddress: address.uiSchema(
      'Address connected to your past application',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      previousSahApplicationDate: {
        pattern:
          '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)-(0[1-9]|[1-2][0-9]|3[0-1]|XX)$',
        type: 'string',
      },
      previousSahApplicationAddress: address.schema(fullSchema, true),
    },
  },
};

export default previousSahApplication2;
