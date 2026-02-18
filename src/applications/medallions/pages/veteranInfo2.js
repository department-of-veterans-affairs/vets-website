import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberNoHintUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { merge } from 'lodash';

import { validateSSN } from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran personal information',
      'You can enter a Social Security number or VA file number.',
    ),
    veteranId: merge({}, ssnOrVaFileNumberNoHintUI(), {
      ssn: {
        'ui:validations': [validateSSN],
        'ui:errorMessages': {
          pattern:
            'Please enter a valid 9 digit Social Security number (dashes allowed)',
        },
        'ui:title': 'Veteran’s Social Security number',
      },
      vaFileNumber: {
        'ui:errorMessages': {
          pattern: 'The VA file number must be 7 to 9 digits',
        },
        'ui:options': {
          hideEmptyValueInReview: false,
        },
      },
      'ui:options': {
        updateSchema: _schema => {
          return {
            ..._schema,
            required: ['ssn'],
          };
        },
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranId: merge({}, ssnOrVaFileNumberSchema, {
        properties: {
          ssn: {
            maxLength: 11,
          },
          vaFileNumber: {
            maxLength: 9,
            pattern: '^\\d{7,9}$',
          },
        },
        required: [],
      }),
    },
  },
};
