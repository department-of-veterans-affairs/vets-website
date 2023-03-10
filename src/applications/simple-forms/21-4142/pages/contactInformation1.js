import React from 'react';
import { intersection, pick } from 'lodash';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.address];

export default {
  uiSchema: {
    'view:title': {
      'ui:description': (
        <>
          <h3>Mailing Address</h3>
          <p className="vads-u-margin-bottom--4">
            We&rsquo;ll send any updates about your application to this address.
          </p>
        </>
      ),
    },
    [veteranFields.parentObject]: {
      [veteranFields.address]: addressUiSchema(
        `${[veteranFields.parentObject]}.${[veteranFields.address]}`,
        undefined,
        () => true,
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:title': {
        type: 'object',
        properties: {},
      },
      [veteranFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
