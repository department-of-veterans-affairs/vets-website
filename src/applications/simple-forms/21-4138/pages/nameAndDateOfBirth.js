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
export const nonVeteranDateOfBirthPage = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => getNameAndDobPageTitle(formData),
      ({ formData }) => getNameAndDobPageDescription(formData),
    ),
    nonVeteranFullName: fullNameNoSuffixUI(label =>
      getFullNameLabels(label, true),
    ),
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

/** @type {PageSchema} */
export const veteranNameAndDateofBirthPageA = {
  uiSchema: {
    ...titleUI(
      ({ formData }) => getNameAndDobPageTitle(formData),
      ({ formData }) => getNameAndDobPageDescription(formData),
    ),
    veteranFullName: fullNameNoSuffixUI(label =>
      getFullNameLabels(label, true),
    ),
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

/** @type {PageSchema} */
export const veteranNameAndDateofBirthPageB = {
  uiSchema: {
    ...titleUI(
      'Veteran’s name and date of birth',
      'Please provide the Veteran’s information.',
    ),
    veteranFullName: fullNameNoSuffixUI(label =>
      getFullNameLabels(label, true),
    ),
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
