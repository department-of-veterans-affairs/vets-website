import { cloneDeep } from 'lodash';

import { fullNameDeprecatedUI } from '../../shared/definitions/rjsfPatterns';
import { pdfFullNameNoSuffixSchema } from '../../shared/definitions/pdfFullNameNoSuffix';

const authorizerFullNameUI = cloneDeep(fullNameDeprecatedUI);

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
      authorizerFullName: pdfFullNameNoSuffixSchema({
        pdfMaxLengths: { first: 12, middle: 1, last: 18 },
      }),
    },
  },
};
