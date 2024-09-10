import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { primaryMailingAddressOptions } from '../../constants/options';

/** @type {PageSchema} */
export default {
  title: 'Primary mailing address',
  path: 'primary-mailing-address',
  uiSchema: {
    ...titleUI('Primary mailing address'),
    primaryMailingAddress: radioUI({
      title:
        'What address would you like to receive communication from the Office of General Counsel (OGC)?',
      labels: primaryMailingAddressOptions,
      descriptions: {
        work:
          'You will enter this address in Step 3, “Employment information.”',
        other:
          'If you select this option, you will enter an address on the next screen.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      primaryMailingAddress: radioSchema(
        Object.keys(primaryMailingAddressOptions),
      ),
    },
    required: ['primaryMailingAddress'],
  },
};
