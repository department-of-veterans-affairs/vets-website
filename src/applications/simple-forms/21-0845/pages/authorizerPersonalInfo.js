import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerFullName: fullNameUI,
  },
  schema: {
    type: 'object',
    required: ['authorizerFullName'],
    properties: {
      authorizerFullName: schema({
        pdfMaxLengths: { first: 12, middle: 18, last: 18 },
      }),
    },
  },
};
