import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameNoSuffixSchema,
  fullNameNoSuffixUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranFullName: fullNameNoSuffixUI(),
    veteranDateOfBirth: dateOfBirthUI(),
    veteranDateOfDeath: currentOrPastDateUI('Date of death'),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName: fullNameNoSuffixSchema,
      veteranDateOfBirth: dateOfBirthSchema,
      veteranDateOfDeath: currentOrPastDateSchema,
    },
    // TODO: UNCOMMENT ONCE DATE IS FIXED
    // required: ['veteranDateOfBirth'],
  },
};
