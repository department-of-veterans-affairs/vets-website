import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';

export default {
  uiSchema: {
    veteranFullName: fullNameUI,
    veteranDateOfBirth: {
      'ui:title': 'Date of birth',
      'ui:widget': 'date',
    },
  },
  schema: {
    type: 'object',
    required: ['veteranFullName'],
    properties: {
      veteranFullName: definitions.fullNameNoSuffix,
      veteranDateOfBirth: definitions.date,
    },
  },
};
