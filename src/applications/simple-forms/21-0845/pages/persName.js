import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Tell us who we can release your information to.',
    personFullName: fullNameUI,
  },
  schema: {
    type: 'object',
    required: ['personFullName'],
    properties: {
      personFullName: formDefinitions.pdfFullNameNoSuffix,
    },
  },
};
