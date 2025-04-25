import React from 'react';
import { intersection, pick } from 'lodash';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import environment from 'platform/utilities/environment';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.address];

/** @type {PageSchema} */
export default {
  uiSchema: environment.isProduction()
    ? {
        [veteranFields.parentObject]: {
          'ui:description': (
            <p>
              We’ll send any updates about your authorization to this address
            </p>
          ),
          [veteranFields.address]: addressUiSchema(
            `${[veteranFields.parentObject]}.${[veteranFields.address]}`,
            'The Veteran lives on a United States military base outside of the U.S.',
            () => true,
          ),
        },
      }
    : {},
  schema: {
    type: 'object',
    properties: environment.isProduction()
      ? {
          [veteranFields.parentObject]: {
            type: 'object',
            required: intersection(required, pageFields),
            properties: pick(properties, pageFields),
          },
        }
      : {},
  },
};
