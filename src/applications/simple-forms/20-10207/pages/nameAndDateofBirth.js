import { fullNameNoSuffixUI } from 'platform/forms-system/src/js/web-component-patterns/fullNamePattern.js';

import {
  dateOfBirthSchema,
  dateOfBirthUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';

import { getNameAndDobPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // TODO: Use ...titleUI() once that supports functions for title
    'ui:title': ({ formData }) => getNameAndDobPageTitle(formData),
    fullName: fullNameNoSuffixUI(),
    dateOfBirth: dateOfBirthUI(),
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
