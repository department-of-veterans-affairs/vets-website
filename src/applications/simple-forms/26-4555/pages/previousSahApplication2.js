import { intersection, pick } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import { previousSahApplicationFields } from '../definitions/constants';
import fullSchema from '../26-4555-schema.json';

const { required, properties } = fullSchema.properties[
  previousSahApplicationFields.parentObject
];
const pageFields = [
  previousSahApplicationFields.previousSahApplicationDate,
  previousSahApplicationFields.previousSahApplicationAddress,
];
const previousSahApplication2 = {
  uiSchema: {
    [previousSahApplicationFields.previousSahApplicationDate]: {
      'ui:title': 'Date of previous application',
      'ui:widget': 'date',
    },
    // can't use ('...', true) here to turn on line 3
    // check if usAddress or profileAddress definitions work better for that
    [previousSahApplicationFields.previousSahApplicationAddress]: address.uiSchema(
      'Address connected to your past application',
      false,
      formData => formData.hasPreviousSahApplication,
    ),
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    properties: {
      ...pick(properties, pageFields),
      // address definitions appear to be implemented differently
      [previousSahApplicationFields.previousSahApplicationAddress]: address.schema(
        fullSchema,
        true,
      ),
    },
  },
};

export default previousSahApplication2;
