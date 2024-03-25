import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      () => {
        const isEdit = window.location.search.includes('edit=true');
        return isEdit
          ? 'Edit name and address of employer or unit'
          : 'Name and address of employer or unit';
      },
      () => {
        const isEdit = window.location.search.includes('edit=true');
        return isEdit
          ? 'We’ll take you through each of the sections of this employer for you to review and edit'
          : '';
      },
    ),
    name: {
      'ui:title': 'Name of employer',
      'ui:webComponentField': VaTextInputField,
    },
    address: addressNoMilitaryUI({ omit: ['street2', 'street3'] }),
  },
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      address: addressNoMilitarySchema({ omit: ['street2', 'street3'] }),
    },
    required: ['name'],
  },
};
