import {
  textSchema,
  textUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3 } from '../../../constants';

const theirVRECounselorPage = {
  uiSchema: {
    ...titleUI({
      title: CHAPTER_3.THEIR_VRE_COUNSELOR.TITLE,
      classNames: 'vads-u-color--base',
    }),
    theirVRECounselor: textUI({
      title: CHAPTER_3.THEIR_VRE_COUNSELOR.DESCRIPTION,
      errorMessages: {
        required: CHAPTER_3.THEIR_VRE_COUNSELOR.ERROR,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['theirVRECounselor'],
    properties: {
      theirVRECounselor: textSchema,
    },
  },
};

export default theirVRECounselorPage;
