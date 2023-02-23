import { intersection, pick } from 'lodash';

import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { previousHiApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousHiApplicationFields.parentObject
];
const pageFields = [
  previousHiApplicationFields.previousHiApplicationDate,
  previousHiApplicationFields.previousHiApplicationAddress,
];

export default {
  uiSchema: {
    [previousHiApplicationFields.hasPreviousHiApplication]: {
      'ui:title':
        'Details about your past application for a special home adaptation grant',
      [previousHiApplicationFields.previousHiApplicationDate]: dateUI(
        'Date of previous application',
      ),
      [previousHiApplicationFields.previousHiApplicationAddress]: address.uiSchema(
        'Address connected to your past application',
        false,
        formData =>
          formData[previousHiApplicationFields.parentObject][
            previousHiApplicationFields.hasPreviousHiApplication
          ],
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [previousHiApplicationFields.parentObject]: {
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
    },
  },
};
