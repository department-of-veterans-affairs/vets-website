import {
  ssnUI,
  ssnSchema,
  vaFileNumberUI,
  vaFileNumberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranSSN: ssnUI(),
    veteranVaFileNumber: vaFileNumberUI(),
    veteranVaInsuranceFileNumber: {
      'ui:title': 'VA Insurance File number (if available)',
      'ui:errorMessages': {
        maxLength: 'Please enter a number with fewer than 20 digits.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranSSN'],
    properties: {
      veteranSSN: ssnSchema,
      veteranVaFileNumber: vaFileNumberSchema,
      veteranVaInsuranceFileNumber: {
        type: 'string',
        maxLength: 20,
      },
    },
  },
};
