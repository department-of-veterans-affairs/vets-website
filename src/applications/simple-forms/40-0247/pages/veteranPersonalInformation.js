import {
  dateOfBirthSchema,
  dateOfDeathSchema,
  currentOrPastDateDigitsUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranFullName: fullNameNoSuffixUI(),
    // TODO: Check if month text-input can be styled narrower
    veteranDateOfBirth: currentOrPastDateDigitsUI('Date of birth'),
    veteranDateOfDeath: currentOrPastDateDigitsUI('Date of death'),
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
