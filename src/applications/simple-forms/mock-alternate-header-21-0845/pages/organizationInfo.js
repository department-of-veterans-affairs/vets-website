import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleH1UI("Organization's information"),
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
      organizationName: {
        type: 'string',
      },
      organizationAddress: addressNoMilitarySchema(),
    },
  },
};
