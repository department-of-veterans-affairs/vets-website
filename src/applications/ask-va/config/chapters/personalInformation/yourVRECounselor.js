import {
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';

const yourVRECounselorPage = {
  uiSchema: {
    ...titleUI({
      title: CHAPTER_3.YOUR_VRE_COUNSELOR.TITLE,
      classNames: 'vads-u-color--base',
    }),
    yourVRECounselor: textUI({
      title: CHAPTER_3.YOUR_VRE_COUNSELOR.DESCRIPTION,
      errorMessages: {
        required: CHAPTER_3.YOUR_VRE_COUNSELOR.ERROR,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['yourVRECounselor'],
    properties: {
      yourVRECounselor: textSchema,
    },
  },
};

export default yourVRECounselorPage;
