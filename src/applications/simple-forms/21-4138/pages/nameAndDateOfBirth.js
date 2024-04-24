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
export const nameAndDateOfBirthPage = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => getNameAndDobPageTitle(formData),
      ({ formData }) => getNameAndDobPageDescription(formData),
    ),
    fullName: fullNameNoSuffixUI(label => getFullNameLabels(label, true)),
    dateOfBirth: dateOfBirthUI({ required: true }),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      dateOfBirth: dateOfBirthSchema,
    },
    required: ['fullName', 'dateOfBirth'],
  },
};
