import React from 'react';
import { intersection, pick } from 'lodash';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import environment from 'platform/utilities/environment';
import {
  titleUI,
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
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
    : {
        [veteranFields.parentObject]: {
          ...titleUI(
            'Mailing address',
            'We’ll send any important information about your application to this address.',
          ),
          [veteranFields.address]: addressUI({
            labels: {
              street2: 'Apartment or unit number',
            },
            omit: ['street3'],
            required: true,
          }),
        },
      },
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
      : {
          [veteranFields.parentObject]: {
            type: 'object',
            properties: {
              [veteranFields.address]: addressSchema({ omit: ['street3'] }),
            },
          },
        },
  },
};
