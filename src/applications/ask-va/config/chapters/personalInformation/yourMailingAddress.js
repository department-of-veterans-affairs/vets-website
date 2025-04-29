import {
  addressSchema,
  addressUI,
  titleUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';

export default {
  uiSchema: {
    ...titleUI(CHAPTER_3.YOUR_MAILING_ADDRESS.TITLE),
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
  },
};
