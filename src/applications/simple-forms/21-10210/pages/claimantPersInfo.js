import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';

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
    required: ['claimantFullName'],
    properties: {
      claimantFullName: definitions.fullNameNoSuffix,
      claimantDateOfBirth: definitions.date,
    },
  },
};
