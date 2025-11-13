import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CONTACT_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      CONTACT_INFORMATION_CHAPTER_CONSTANTS.newAddressPageTitle,
      "You told us you're moving in the next 30 days. Enter your new mailing address.",
    ),
    newAddress: addressUI({
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      newAddress: addressSchema(),
    },
  },
};
