import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { previousSahApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousSahApplicationFields.parentObject
];
const pageFields = [previousSahApplicationFields.hasPreviousSahApplication];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [previousSahApplicationFields.parentObject]: {
      ...titleUI('Specially adapted housing grant applications'),
      [previousSahApplicationFields.hasPreviousSahApplication]: yesNoUI({
        title:
          'Have you applied for a specially adapted housing (SAH) grant before?',
        errorMessages: {
          required:
            'Select yes if you have applied for a specially adapted housing (SAH) grant before',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [previousSahApplicationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
