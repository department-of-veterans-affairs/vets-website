import { intersection } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { veteranFields } from '../definitions/constants';

const { required } = fullSchema.properties[veteranFields.parentObject];
const pageFields = [veteranFields.address];
const addressUiSchema = {
  ...address.uiSchema('Mailing address'),
  'ui:description':
    "We'll send any updates about your application to this address.",
};
const contactInformation1 = {
  uiSchema: {
    // can't use ('Mailing address', true) here to turn on line 3
    // check if usAddress or profileAddress definitions works better for that
    [veteranFields.address]: addressUiSchema,
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    // can't use pick(properties, pageFields) here
    // address definitions appear to be implemented differently
    properties: {
      [veteranFields.address]: address.schema(fullSchema, true),
    },
  },
};

export default contactInformation1;
