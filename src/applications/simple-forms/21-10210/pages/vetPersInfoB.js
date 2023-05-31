import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';

// for Flow3: self claim, non-vet claimant
/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Tell us about the Veteran you’re connected to',
    veteranFullName: fullNameUI,
    veteranDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName', 'veteranDateOfBirth'],
    properties: {
      veteranFullName: formDefinitions.pdfFullNameNoSuffix,
      veteranDateOfBirth: definitions.date,
    },
  },
};
