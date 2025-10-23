import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import {
  titleUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { livingSituationFields } from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  livingSituationFields.parentObject
];
const pageFields = [livingSituationFields.isInCareFacility];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [livingSituationFields.parentObject]: {
      ...titleUI('Current arrangement'),
      [livingSituationFields.isInCareFacility]: yesNoUI({
        title: 'Do you live in a nursing home or medical care facility?',
        errorMessages: {
          required:
            'Select yes if you live in a nursing home or medical care facility',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [livingSituationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: pick(properties, pageFields),
      },
    },
  },
};
