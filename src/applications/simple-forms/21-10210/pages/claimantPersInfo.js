import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';

export default {
  uiSchema: {
    claimantFullName: fullNameUI,
    claimantDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:description':
        'Please enter two digits for the month and day and four digits for the year.',
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
