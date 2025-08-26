import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantSSN: ssnUI(),
    claimantVaFileNumber: vaFileNumberUI(),
    claimantVaInsuranceFileNumber: {
      'ui:title': 'VA Insurance File Number (if available)',
      'ui:errorMessages': {
        maxLength: 'Please enter a number with fewer than 20 digits.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantSSN'],
    properties: {
      claimantSSN: ssnSchema,
      claimantVaFileNumber: vaFileNumberSchema,
      claimantVaInsuranceFileNumber: {
        type: 'string',
        maxLength: 20,
      },
    },
  },
};
