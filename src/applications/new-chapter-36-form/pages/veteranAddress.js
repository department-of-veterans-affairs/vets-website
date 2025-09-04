import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VET_SM_INFO_CHAPTER_CONSTANTS } from '../constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      VET_SM_INFO_CHAPTER_CONSTANTS.veteranAddressPageTitle,
      VET_SM_INFO_CHAPTER_CONSTANTS.veteranAddressPageDescription,
    ),
    veteranMailingAddress: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      veteranMailingAddress: addressSchema(),
    },
  },
};
