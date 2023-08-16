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
      veteranFullName: {
        ...fullNameNoSuffixSchema,
        properties: {
          ...fullNameNoSuffixSchema.properties,
          first: { ...fullNameNoSuffixSchema.properties.first, maxLength: 12 },
          // TODO: Check if middle should also have maxLength: 1 set for PDF
          last: { ...fullNameNoSuffixSchema.properties.last, maxLength: 18 },
        },
      },
      veteranDateOfBirth: dateOfBirthSchema,
      veteranDateOfDeath: dateOfDeathSchema,
    },
    required: ['veteranFullName'],
  },
};
