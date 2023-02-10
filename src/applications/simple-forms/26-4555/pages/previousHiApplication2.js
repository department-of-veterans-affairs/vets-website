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
    [previousHiApplicationFields.previousHiApplicationDate]: {
      'ui:title': 'Date of previous application',
      'ui:widget': 'date',
    },
    // can't use ('...', true) here to turn on line 3
    // check if usAddress or profileAddress definitions work better for that
    [previousHiApplicationFields.previousHiApplicationAddress]: address.uiSchema(
      'Address connected to your past application',
      false,
      formData => formData.hasPreviousHiApplication,
    ),
  },
  schema: {
    type: 'object',
    required: intersection(required, pageFields),
    // can't use pick(properties, pageFields) here
    // address definitions appear to be implemented differently
    properties: {
      ...pick(properties, pageFields),
      [previousHiApplicationFields.previousHiApplicationAddress]: address.schema(
        fullSchema,
        true,
      ),
    },
  },
};

export default previousHiApplication2;
