import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Name and date of birth'),
    survivingDependentFullName: fullNameNoSuffixUI(),
    survivingDependentDateOfBirth: dateOfBirthUI(),
  },
  schema: {
    type: 'object',
    properties: {
      survivingDependentFullName: fullNameNoSuffixSchema,
      survivingDependentDateOfBirth: dateOfBirthSchema,
    },
    required: ['survivingDependentFullName', 'survivingDependentDateOfBirth'],
  },
};
