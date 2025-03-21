import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import {
  titleUI,
  currentOrPastDateUI,
  selectSchema,
  selectUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VA_REGIONAL_OFFICE_CITIES,
  previousSahApplicationFields,
} from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousSahApplicationFields.parentObject
];
const pageFields = [
  previousSahApplicationFields.previousSahApplicationDate,
  // previousSahApplicationFields.previousSahApplicationAddress,
  // omitted because unused, will be restored when vets-json-schema is changed
];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [previousSahApplicationFields.parentObject]: {
      ...titleUI(
        'Past SAH grant application details',
        'Tell us about your last SAH application',
      ),
      [previousSahApplicationFields.previousSahApplicationDate]: currentOrPastDateUI(
        'Date you last applied',
      ),
      [previousSahApplicationFields.previousSahApplicationAddress]: {
        city: selectUI(
          'Select the city of the VA regional office connected with your past application (if you know it)',
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [previousSahApplicationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: {
          ...pick(properties, pageFields),
          [previousSahApplicationFields.previousSahApplicationAddress]: {
            type: 'object',
            properties: {
              city: selectSchema(VA_REGIONAL_OFFICE_CITIES),
            },
          },
        },
      },
    },
  },
};
