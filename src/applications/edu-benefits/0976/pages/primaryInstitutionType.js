// @ts-check
import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { INSTITUTION_TYPES } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    primaryInstitutionDetails: {
      ...titleUI('Institution classification'),
      type: {
        ...radioUI({
          title: 'Which best describes this institution?',
          required: () => true,
          labels: INSTITUTION_TYPES,
          errorMessages: {
            required: 'You must make a selection',
          },
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      primaryInstitutionDetails: {
        type: 'object',
        properties: {
          type: radioSchema(Object.keys(INSTITUTION_TYPES)),
        },
        required: ['type'],
      },
    },
  },
};
