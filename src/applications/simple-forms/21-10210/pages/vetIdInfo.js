import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranSSN: ssnUI(),
    veteranVaFileNumber: vaFileNumberUI(),
    veteranVaInsuranceFileNumber: textUI({
      title: 'VA Insurance File number (if available)',
      errorMessages: {
        maxLength: 'Please enter a number with fewer than 20 digits.',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['veteranSSN'],
    properties: {
      veteranSSN: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
      veteranVaInsuranceFileNumber: {
        ...textSchema,
        maxLength: 20,
      },
    },
  },
};
