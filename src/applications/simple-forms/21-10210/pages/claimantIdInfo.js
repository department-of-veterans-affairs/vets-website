import definitions from 'vets-json-schema/dist/definitions.json';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import { CLAIM_OWNERSHIPS } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    claimantSSN: ssnUI,
    claimantVaFileNumber: {
      'ui:errorMessages': {
        pattern:
          "Please enter a valid VA file number.  All should have 7-9 digits; some may start with a 'C'",
      },
      'ui:options': {
        updateSchema: formData => {
          const title =
            formData.claimOwnership === CLAIM_OWNERSHIPS.SELF
              ? 'VA file number (if you have one)'
              : 'VA file number (if Claimant has one)';
          return { title };
        },
      },
    },
    claimantVaInsuranceFileNumber: {
      'ui:title': 'VA Insurance File Number (if you have one)',
      'ui:errorMessages': {
        maxLength: 'Please enter a number with fewer than 20 digits.',
      },
      'ui:options': {
        updateSchema: formData => {
          const title =
            formData.claimOwnership === CLAIM_OWNERSHIPS.SELF
              ? 'VA Insurance File number (if you have one)'
              : 'VA Insurance File number (if Claimant has one)';
          return { title };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['claimantSSN'],
    properties: {
      claimantSSN: definitions.ssn,
      claimantVaFileNumber: definitions.vaFileNumber,
      claimantVaInsuranceFileNumber: {
        type: 'string',
        maxLength: 20,
      },
    },
  },
};
