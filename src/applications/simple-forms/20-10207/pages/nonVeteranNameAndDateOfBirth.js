import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getNameAndDobPageTitle } from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(({ formData }) => getNameAndDobPageTitle(formData)),
    nonVeteranFullName: fullNameNoSuffixUI(),
    nonVeteranDateOfBirth: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    properties: {
      nonVeteranFullName: fullNameNoSuffixSchema,
      nonVeteranDateOfBirth: dateOfBirthSchema,
    },
    required: ['nonVeteranFullName', 'nonVeteranDateOfBirth'],
  },
};
