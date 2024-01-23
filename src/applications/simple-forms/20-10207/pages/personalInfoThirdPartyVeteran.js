import { cloneDeep } from 'lodash';

import { fullNameNoSuffixUI } from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern.js';

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';

const fullNameUI = cloneDeep(fullNameNoSuffixUI());

fullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Veteran’s name and date of birth'),
    fullName: fullNameUI,
    dateOfBirth: dateOfBirthUI(),
    updateSchemaAndData: () => {},
  },
  schema: {
    type: 'object',
    properties: {
      fullName: pdfFullNameNoSuffixSchema({
        pdfMaxLengths: { first: 12, middle: 1, last: 18 },
      }),
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
