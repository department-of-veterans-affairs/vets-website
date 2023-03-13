import React from 'react';
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
  // previousSahApplicationFields.previousSahApplicationAddress,
  // omitted because unused, will be restored when vets-json-schema is changed
];

export default {
  uiSchema: {
    [previousSahApplicationFields.parentObject]: {
      'ui:description': (
        <h3>
          Details about your previous application for a specially adapted
          housing grant
        </h3>
      ),
      [previousSahApplicationFields.previousSahApplicationDate]: dateUI(
        'Date of previous application',
      ),
      'view:addressDescription': {
        'ui:description': 'Address connected to your past application',
      },
      [previousSahApplicationFields.previousSahApplicationAddress]: address.uiSchema(
        '',
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
          'view:addressDescription': {
            type: 'object',
            properties: {},
          },
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
