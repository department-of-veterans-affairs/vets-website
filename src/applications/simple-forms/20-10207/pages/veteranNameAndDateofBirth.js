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
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
    },
    required: ['veteranFullName', 'veteranDateOfBirth'],
  },
};
