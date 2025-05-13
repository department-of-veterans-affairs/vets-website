import {
  titleUI,
  fullNameUI,
  fullNameSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { merge } from 'lodash';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran name'),
    veteranFullName: merge({}, fullNameUI(), {
      first: {
        'ui:errorMessages': {
          required: 'Enter a first name',
        },
      },
      last: {
        'ui:errorMessages': {
          required: 'Enter a last name',
        },
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: merge({}, fullNameSchema, {
        properties: {
          first: {
            maxLength: 15,
            'ui:errorMessages': {
              required: 'Enter a first name',
            },
          },
          middle: {
            maxLength: 15,
          },
          last: {
            maxLength: 25,
          },
          suffix: {
            enum: ['Jr.', 'Sr.', 'II', 'III', 'IV', 'V'],
          },
        },
      }),
    },
  },
};
