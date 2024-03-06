import {
  dateOfBirthSchema,
  dateOfBirthUI,
  firstNameLastNameNoSuffixSchema,
  firstNameLastNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { getNameAndDobPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(({ formData }) => getNameAndDobPageTitle(formData)),
    fullName: firstNameLastNameNoSuffixUI(),
    dateOfBirth: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: firstNameLastNameNoSuffixSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
