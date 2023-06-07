import definitions from 'vets-json-schema/dist/definitions.json';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';

/** @type {PageSchema} */
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
      veteranFullName: formDefinitions.pdfFullNameNoSuffix,
      veteranDateOfBirth: definitions.date,
    },
  },
};
