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
    claimantSSN: ssnUI(),
    claimantVaFileNumber: vaFileNumberUI(),
    claimantVaInsuranceFileNumber: textUI({
      title: 'VA Insurance File Number (if available)',
      errorMessages: {
        maxLength: 'Please enter a number with fewer than 20 digits.',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantSSN'],
    properties: {
      claimantSSN: ssnSchema,
      claimantVaFileNumber: vaFileNumberSchema,
      claimantVaInsuranceFileNumber: {
        ...textSchema,
        maxLength: 20,
      },
    },
  },
};
