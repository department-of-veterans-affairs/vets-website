import React from 'react';
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
  // previousHiApplicationFields.previousHiApplicationAddress,
  // omitted because unused, will be restored when vets-json-schema is changed
];

export default {
  uiSchema: {
    [previousHiApplicationFields.parentObject]: {
      'ui:description': (
        <h3>
          Details about your past application for a special home adaptation
          grant
        </h3>
      ),
      [previousHiApplicationFields.previousHiApplicationDate]: dateUI(
        'Date of previous application',
      ),
      'view:addressDescription': {
        'ui:description': 'Address connected to your past application',
      },
      [previousHiApplicationFields.previousHiApplicationAddress]: address.uiSchema(
        '',
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
          'view:addressDescription': {
            type: 'object',
            properties: {},
          },
          [previousHiApplicationFields.previousHiApplicationAddress]: address.schema(
            fullSchema,
            formData =>
              formData[previousHiApplicationFields.parentObject][
                previousHiApplicationFields.hasPreviousHiApplication
              ],
          ),
        },
      },
    },
  },
};
