import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Mailing address'),
    'ui:description':
      'We’ll send any important information about your application to this address',
    claimantAddress: {
      ...addressUI({
        labels: {
          militaryCheckbox:
            'I live on a United States military base outside of the U.S.',
        },
        omit: ['street3'],
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['claimantAddress'],
    properties: {
      claimantAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};
