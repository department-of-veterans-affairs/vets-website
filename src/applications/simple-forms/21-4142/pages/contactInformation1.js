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
    [veteranFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
          Mailing Address
        </h3>
      ),
      'ui:description': (
        <div className="vads-u-margin-bottom--4">
          We&rsquo;ll send any updates about your application to this address.
        </div>
      ),
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
      [veteranFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
