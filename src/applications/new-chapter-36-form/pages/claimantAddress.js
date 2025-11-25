import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { YOUR_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      YOUR_INFORMATION_CHAPTER_CONSTANTS.claimantAddressPageTitle,
      "We'll send any important information about your application to this address.",
    ),
    claimantAddress: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      claimantAddress: addressSchema(),
    },
  },
};
