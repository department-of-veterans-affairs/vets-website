import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { previousHiApplicationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousHiApplicationFields.parentObject
];
const pageFields = [previousHiApplicationFields.hasPreviousHiApplication];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [previousHiApplicationFields.parentObject]: {
      ...titleUI('Special home adaptation grant applications'),
      [previousHiApplicationFields.hasPreviousHiApplication]: yesNoUI({
        title:
          'Have you applied for a special home adaptation (SHA) grant before?',
        errorMessages: {
          required:
            'Select yes if you have applied for a special home adaptation (SHA) grant before',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [previousHiApplicationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
