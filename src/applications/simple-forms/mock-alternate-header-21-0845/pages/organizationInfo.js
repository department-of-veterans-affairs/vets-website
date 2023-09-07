import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { titleH1Schema, titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:title': titleH1UI("Organization's information"),
    organizationName: {
      'ui:title': 'Name of organization',
      'ui:webComponentField': VaTextInputField,
    },
    organizationAddress: addressNoMilitaryUI(),
  },
  schema: {
    type: 'object',
    required: ['organizationName', 'organizationAddress'],
    properties: {
      'view:title': titleH1Schema,
      organizationName: {
        type: 'string',
      },
      organizationAddress: addressNoMilitarySchema(),
    },
  },
};
