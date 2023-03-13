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
  previousHiApplicationFields.previousHiApplicationAddress,
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
      [previousHiApplicationFields.previousHiApplicationAddress]: address.uiSchema(
        '',
        false,
        formData =>
          formData[previousHiApplicationFields.parentObject][
            previousHiApplicationFields.hasPreviousHiApplication
          ],
        false,
        'Address connected to your past application',
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
