import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const theirVREInformationPage = {
  uiSchema: {
    theirVREInformation: yesNoUI({
      title: CHAPTER_3.THEIR_VRE_INFORMATION.TITLE,
      labelHeaderLevel: '3',
      labels: yesNoOptions,
      errorMessages: {
        required: CHAPTER_3.THEIR_VRE_INFORMATION.ERROR,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['theirVREInformation'],
    properties: {
      theirVREInformation: yesNoSchema,
    },
  },
};

export default theirVREInformationPage;
