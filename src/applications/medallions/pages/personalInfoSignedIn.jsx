import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { applicantSaveAppText } from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantSaveAppText,
    ...titleUI('Confirm the personal information we have on file for you'),
    // fullName: fullNameNoSuffixUI(),
    // dateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      // fullName: fullNameNoSuffixSchema,
      // dateOfBirth: dateOfBirthSchema,
    },
    // required: ['fullName', 'dateOfBirth'],
  },
};
