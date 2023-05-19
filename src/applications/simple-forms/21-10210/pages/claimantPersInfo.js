import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';

export default {
  uiSchema: {
    claimantFullName: fullNameUI,
    claimantDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
    },
  },
  schema: {
    type: 'object',
    required: ['claimantFullName', 'claimantDateOfBirth'],
    properties: {
      claimantFullName: formDefinitions.pdfFullNameNoSuffix,
      claimantDateOfBirth: definitions.date,
    },
  },
};
