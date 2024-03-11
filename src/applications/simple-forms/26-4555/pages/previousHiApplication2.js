import { intersection, pick } from 'lodash';

import fullSchema from 'vets-json-schema/dist/26-4555-schema.json';
import {
  titleUI,
  currentOrPastDateUI,
  selectUI,
  selectSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  VA_REGIONAL_OFFICE_CITIES,
  previousHiApplicationFields,
} from '../definitions/constants';

const { required, properties } = fullSchema.properties[
  previousHiApplicationFields.parentObject
];
const pageFields = [
  previousHiApplicationFields.previousHiApplicationDate,
  // previousHiApplicationFields.previousHiApplicationAddress,
  // omitted because unused, will be restored when vets-json-schema is changed
];

/** @type {PageSchema} */
export default {
  uiSchema: {
    [previousHiApplicationFields.parentObject]: {
      ...titleUI(
        'Past SHA grant application details',
        'Tell us about your last SHA application',
      ),
      [previousHiApplicationFields.previousHiApplicationDate]: currentOrPastDateUI(
        'Date you last applied',
      ),
      [previousHiApplicationFields.previousHiApplicationAddress]: {
        city: selectUI(
          'Select the city of the VA regional office connected with your past application (if you know it)',
        ),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [previousHiApplicationFields.parentObject]: {
        type: 'object',
        required: intersection(required, pageFields),
        properties: {
          ...pick(properties, pageFields),
          [previousHiApplicationFields.previousHiApplicationAddress]: {
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
