import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import formDefinitions from '../definitions/form-definitions';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerFullName: fullNameUI,
  },
  schema: {
    type: 'object',
    required: ['authorizerFullName'],
    properties: {
      authorizerFullName: formDefinitions.pdfFullNameNoSuffix,
    },
  },
};
