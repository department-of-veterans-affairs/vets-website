import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleH1UI } from '../components/customTitlePattern';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleH1UI('Your mailing address'),
    address: addressNoMilitaryUI(),
  },
  schema: {
    type: 'object',
    required: ['address'],
    properties: {
      address: addressNoMilitarySchema(),
    },
  },
};
