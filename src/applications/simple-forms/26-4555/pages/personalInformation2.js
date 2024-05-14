import { intersection, pick } from 'lodash';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import {
  titleUI,
  ssnUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  veteranFields.parentObject
];
const pageFields = [veteranFields.ssn];

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    [veteranFields.parentObject]: {
      ...titleUI('Identification information'),
      ssn: ssnUI(),
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
