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
    arrayPath: 'employers',
    nounSingular: 'employer',
    nounPlural: 'employers',
    summaryRoute: '/array-multiple-page-builder-summary',
  }),
  uiSchema: {
    employers: {
      items: {
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
