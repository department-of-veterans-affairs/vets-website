import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { CHAPTER_3, yesNoOptions } from '../../../constants';

const isTheVeteranDeceasedPage = {
  uiSchema: {
    isVeteranDeceased: yesNoUI({
      title: CHAPTER_3.VET_DECEASED.TITLE,
      labelHeaderLevel: '3',
      labels: yesNoOptions,
      errorMessages: {
        required: 'Please let us know if the Veteran is deceased',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['isVeteranDeceased'],
    properties: {
      isVeteranDeceased: yesNoSchema,
    },
  },
};

export default isTheVeteranDeceasedPage;
