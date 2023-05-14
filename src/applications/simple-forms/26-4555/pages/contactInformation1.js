import React from 'react';
import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import addressUiSchema from 'platform/forms-system/src/js/definitions/profileAddress';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.address];

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    [veteranFields.parentObject]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-y--0">
          Mailing address
        </h3>
      ),
      'ui:description': (
        <p className="vads-u-margin-top--1 vads-u-margin-bottom--4">
          We&rsquo;ll send any updates about your application to this address.
        </p>
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
