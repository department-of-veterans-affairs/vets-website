import { cloneDeep } from 'lodash';

import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixUI,
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';

const fullNameUI = cloneDeep(fullNameNoSuffixUI());

fullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI({
      title: 'Your personal information',
      ariaDescribedby: 'Hello world Step 1 or 2',
    }),
    fullName: fullNameUI,
    dateOfBirth: dateOfBirthUI(),
    placeOfBirth: textUI({
      title: 'Place of birth',
      hint: 'City and state or foreign country',
      errorMessages: {
        required: 'Enter your place of birth',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: pdfFullNameNoSuffixSchema({
        pdfMaxLengths: { first: 12, middle: 1, last: 18 },
      }),
      dateOfBirth: dateOfBirthSchema,
      placeOfBirth: textSchema,
    },
    required: ['fullName', 'dateOfBirth', 'placeOfBirth'],
  },
};
