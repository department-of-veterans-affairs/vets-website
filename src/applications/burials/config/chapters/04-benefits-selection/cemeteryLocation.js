import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Cemetery location'),
    cemeteryLocation: {
      'ui:description':
        'You selected that the deceased Veteran was buried in a state cemetery. Enter additional information here.',
      'ui:options': {
        classNames:
          'vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans',
      },
      name: {
        'ui:title': 'Name of state cemetery',
        'ui:webComponentField': VaTextInputField,
      },
      zip: {
        'ui:title': 'Zip code for state cemetery',
        'ui:webComponentField': VaTextInputField,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      cemeteryLocation: {
        type: 'object',
        required: ['name', 'zip'],
        properties: {
          name: {
            type: 'string',
          },
          zip: {
            type: 'string',
          },
        },
      },
    },
  },
};
