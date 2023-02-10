import { intersection, pick } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import { previousHiApplicationFields } from '../definitions/constants';
import fullSchema from '../26-4555-schema.json';

const { required, properties } = fullSchema.properties[
  previousHiApplicationFields.parentObject
];
const pageFields = [
  previousHiApplicationFields.previousHiApplicationDate,
  previousHiApplicationFields.previousHiApplicationAddress,
];

const previousHiApplication2 = {
  uiSchema: {
    ...pick(properties, pageFields),
    // check if usAddress or profileAddress definitions works better for that
    [previousHiApplicationFields.previousHiApplicationAddress]: address.uiSchema(
      'Address connected to your past application',
      false,
      formData => formData.hasPreviousHiApplication,
    ),
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: {
      ...pick(properties, pageFields),
      // address definitions appear to be implemented differently
      [previousHiApplicationFields.previousHiApplicationAddress]: address.schema(
        fullSchema,
        true,
      ),
    },
  },
};

export default previousHiApplication2;
