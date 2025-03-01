import {
  ssnOrVaFileNumberSchema,
  ssnOrVaFileNumberNoHintUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { merge } from 'lodash';

// import { isValidVAFileNumber } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Veteran personal information',
      'You can enter a Social Security number or VA file number.',
    ),
    veteranId: merge({}, ssnOrVaFileNumberNoHintUI(), {
      ssn: {
        // 'ui:required': false,
        'ui:errorMessages': {
          pattern:
            'Please enter a valid 9 digit Social Security number (dashes allowed)',
        },
      },
      // vaFileNumber: {
      //   'ui:errorMessages': {
      //     pattern: 'The VA file number must be 7 to 9 digits',
      //   },
      //   'ui:validations': [isValidVAFileNumber],
      // }
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
          },
        },
        required: [''],
      }),
    },
  },
};
