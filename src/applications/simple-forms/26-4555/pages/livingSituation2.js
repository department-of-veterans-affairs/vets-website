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

export default {
  uiSchema: {
    [livingSituationFields.parentObject]: {
      'ui:description': <h3>Details about your current living situation</h3>,
      [livingSituationFields.careFacilityName]: {
        'ui:title':
          'What is the name of the nursing home or medical care facility?',
      },
      'view:addressDescription': {
        'ui:description':
          'What is the address of the nursing home or medical care facility you are living in?',
      },
      [livingSituationFields.careFacilityAddress]: address.uiSchema(
        '',
        false,
        formData =>
          formData[livingSituationFields.parentObject][
            livingSituationFields.isInCareFacility
          ],
      ),
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
          'view:addressDescription': {
            type: 'object',
            properties: {},
          },
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
