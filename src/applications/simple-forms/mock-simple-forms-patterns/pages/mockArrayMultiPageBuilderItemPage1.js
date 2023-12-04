import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Name and address of employer or unit'),
    employers: {
      items: {
        name: {
          'ui:title': 'Name of employer',
          'ui:webComponentField': VaTextInputField,
        },
        address4: addressNoMilitaryUI({ omit: ['street2', 'street3'] }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      employers: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            address4: addressNoMilitarySchema({ omit: ['street2', 'street3'] }),
          },
          required: ['name'],
        },
      },
    },
  },
};
