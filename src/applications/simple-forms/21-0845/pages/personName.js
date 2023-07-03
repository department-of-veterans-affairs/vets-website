import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';

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
      personFullName: schema(),
    },
  },
};
