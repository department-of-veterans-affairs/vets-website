import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { healthInsurancePageTitleUI } from '../../utils/titles';

const TITLE_TEXT = 'prescription coverage';
const INPUT_LABEL =
  'Does the beneficiary’s health insurance cover prescriptions?';
const HINT_TEXT =
  'You may find this information on the front of the health insurance card. You can also contact the phone number listed on the back of the card.';

export default {
  uiSchema: {
    ...healthInsurancePageTitleUI(TITLE_TEXT),
    eob: yesNoUI({
      title: INPUT_LABEL,
      hint: HINT_TEXT,
    }),
  },
  schema: {
    type: 'object',
    required: ['eob'],
    properties: {
      eob: yesNoSchema,
    },
  },
};
