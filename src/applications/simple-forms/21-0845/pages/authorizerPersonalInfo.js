import { cloneDeep } from 'lodash';

import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import { schema } from '../../shared/definitions/pdfFullNameNoSuffix';

const authorizerFullNameUI = cloneDeep(fullNameUI);

authorizerFullNameUI.middle['ui:title'] = 'Middle initial';

/** @type {PageSchema} */
export default {
  uiSchema: {
    authorizerFullName: authorizerFullNameUI,
  },
  schema: {
    type: 'object',
    required: ['authorizerFullName'],
    properties: {
      authorizerFullName: schema({
        pdfMaxLengths: { first: 12, middle: 1, last: 18 },
      }),
    },
  },
};
