import { intersection } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import { veteranFields } from '../definitions/constants';
import fullSchema from '../26-4555-schema.json';

const { required } = fullSchema.properties[veteranFields.parentObject];
const pageFields = [veteranFields.address];
const contactInformation1 = {
  uiSchema: {
    // can't use ('Mailing address', true) here to turn on line 3
    // check if usAddress or profileAddress definitions work better for that
    [veteranFields.address]: address.uiSchema('Mailing address'),
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: {
      [veteranFields.address]: address.schema(fullSchema, true),
    },
  },
};

export default contactInformation1;
