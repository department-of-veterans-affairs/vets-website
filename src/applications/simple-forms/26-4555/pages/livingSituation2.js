import React from 'react';
import { intersection, pick } from 'lodash';

import * as address from 'platform/forms-system/src/js/definitions/address';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import { livingSituationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  livingSituationFields.parentObject
];
const pageFields = [
  livingSituationFields.careFacilityName,
  // livingSituationFields.careFacilityAddress,
  // omitted because unused, will be restored when vets-json-schema is changed
];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [livingSituationFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
          Facility details
        </h3>
      ),
      'ui:description': (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
          Tell us more about the nursing home or medical care facility you live
          in
        </p>
      ),
      [livingSituationFields.careFacilityName]: {
        'ui:title': 'Facility name',
      },
      [livingSituationFields.careFacilityAddress]: {
        'ui:description': (
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--4">
            Facility address
          </p>
        ),
        ...address.uiSchema(
          '',
          false,
          formData =>
            formData[livingSituationFields.parentObject][
              livingSituationFields.isInCareFacility
            ],
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [livingSituationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: {
          ...pick(properties, pageFields),
          [livingSituationFields.careFacilityAddress]: address.schema(
            fullSchema,
            formData =>
              formData[livingSituationFields.parentObject][
                livingSituationFields.isInCareFacility
              ],
          ),
        },
      },
    },
  },
};
