import { intersection, pick } from 'lodash';

import dateUI from 'platform/forms-system/src/js/definitions/date';
import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { previousSahApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousSahApplicationFields.parentObject
];
const pageFields = [
  previousSahApplicationFields.previousSahApplicationDate,
  previousSahApplicationFields.previousSahApplicationAddress,
];

export default {
  uiSchema: {
    [previousSahApplicationFields.parentObject]: {
      'ui:title':
        'Details about your previous application for a specially adapted housing grant',
      [previousSahApplicationFields.previousSahApplicationDate]: dateUI(
        'Date of previous application',
      ),
      [previousSahApplicationFields.previousSahApplicationAddress]: address.uiSchema(
        'Address connected to your past application',
        false,
        formData =>
          formData[previousSahApplicationFields.parentObject][
            previousSahApplicationFields.hasPreviousSahApplication
          ],
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [previousSahApplicationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: {
          ...pick(properties, pageFields),
          // address definitions appear to be implemented differently
          [previousSahApplicationFields.previousSahApplicationAddress]: address.schema(
            fullSchema,
            formData =>
              formData[previousSahApplicationFields.parentObject][
                previousSahApplicationFields.hasPreviousSahApplication
              ],
          ),
        },
      },
    },
  },
};
