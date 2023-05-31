import definitions from 'vets-json-schema/dist/definitions.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { CLAIM_OWNERSHIPS } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    veteranSSN: ssnUI,
    veteranVaFileNumber: {
      'ui:errorMessages': {
        pattern:
          "Please enter a valid VA file number.  All should have 7-9 digits; some may start with a 'C'",
      },
      'ui:options': {
        updateSchema: formData => {
          const title =
            formData.claimOwnership === CLAIM_OWNERSHIPS.SELF
              ? 'VA file number (if you have one)'
              : 'VA file number (if Veteran has one)';
          return { title };
        },
      },
    },
    veteranVaInsuranceFileNumber: {
      'ui:errorMessages': {
        maxLength: 'Please enter a number with fewer than 20 digits.',
      },
      'ui:options': {
        updateSchema: formData => {
          const title =
            formData.claimOwnership === CLAIM_OWNERSHIPS.SELF
              ? 'VA Insurance File number (if you have one)'
              : 'VA Insurance File number (if Veteran has one)';
          return { title };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['veteranSSN'],
    properties: {
      veteranSSN: definitions.ssn,
      veteranVaFileNumber: definitions.vaFileNumber,
      veteranVaInsuranceFileNumber: {
        type: 'string',
        maxLength: 20,
      },
    },
  },
};
