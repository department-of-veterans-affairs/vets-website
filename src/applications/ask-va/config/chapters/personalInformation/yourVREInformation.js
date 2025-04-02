import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const yourVREInformationPage = {
  uiSchema: {
    yourVREInformation: yesNoUI({
      title: CHAPTER_3.YOUR_VRE_INFORMATION.TITLE,
      labelHeaderLevel: '3',
      labels: yesNoOptions,
      errorMessages: {
        required: CHAPTER_3.YOUR_VRE_INFORMATION.ERROR,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['yourVREInformation'],
    properties: {
      yourVREInformation: yesNoSchema,
    },
  },
};

export default yourVREInformationPage;
