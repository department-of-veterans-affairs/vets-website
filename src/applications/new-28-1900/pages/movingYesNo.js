import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CONTACT_INFORMATION_CHAPTER_CONSTANTS } from '../constants';

export default {
  uiSchema: {
    ...titleUI(CONTACT_INFORMATION_CHAPTER_CONSTANTS.movingYesNoPageTitle),
    movingYesNo: yesNoUI({
      title: 'Are you moving in the next 30 days?',
      errorMessages: {
        required: 'Select yes or no',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      movingYesNo: yesNoSchema,
    },
    required: ['movingYesNo'],
  },
};
