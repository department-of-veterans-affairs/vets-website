import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  getNameAndDobPageTitle,
  getNameAndDobPageDescription,
  getFullNameLabels,
} from '../helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      ({ formData }) => getNameAndDobPageTitle(formData),
      ({ formData }) => getNameAndDobPageDescription(formData),
    ),
    nonVeteranFullName: fullNameNoSuffixUI(label => getFullNameLabels(label)),
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
