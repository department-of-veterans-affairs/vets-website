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

/** @type {PageSchema} */
export default {
  uiSchema: {
    [previousSahApplicationFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
          Past SAH grant application details
        </h3>
      ),
      'ui:description': (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
          Tell us about your last SAH application
        </p>
      ),
      [previousSahApplicationFields.previousSahApplicationDate]: dateUI(
        'Date you last applied',
      ),
      [previousSahApplicationFields.previousSahApplicationAddress]: {
        'ui:description': (
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--4">
            Address connected to your past application
          </p>
        ),
        ...address.uiSchema(
          '',
          false,
          formData =>
            formData[previousSahApplicationFields.parentObject][
              previousSahApplicationFields.hasPreviousSahApplication
            ],
        ),
      },
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
