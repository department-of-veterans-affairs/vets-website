import {
  dateOfBirthSchema,
  dateOfDeathSchema,
  currentOrPastDateUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: currentOrPastDateUI('Date of birth'),
    veteranDateOfDeath: currentOrPastDateUI('Date of death'),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
      veteranDateOfDeath: dateOfDeathSchema,
    },
    required: ['veteranFullName'],
  },
};
