import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
import ArrayBuilderItemPage from '../arrayBuilder/components/ArrayBuilderItemPage';

/** @type {PageSchema} */
export default {
  CustomPage: ArrayBuilderItemPage({
    buttonText: 'Cancel adding this employer',
    arrayPath: 'employers',
    modalTitle: 'Are you sure you want to cancel adding this employer?',
    modalDescription:
      "If you cancel adding this employer, we won't save the information. You'll return to a screen where you can add or remove employers.",
    summaryRoute: '/array-multiple-page-builder-summary',
  }),
  uiSchema: {
    ...titleUI('Name and address of employer or unit'),
    employers: {
      items: {
        name: {
          'ui:title': 'Name of employer',
          'ui:webComponentField': VaTextInputField,
        },
        address: addressNoMilitaryUI({ omit: ['street2', 'street3'] }),
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
            address: addressNoMilitarySchema({ omit: ['street2', 'street3'] }),
          },
          required: ['name'],
        },
      },
    },
  },
};
