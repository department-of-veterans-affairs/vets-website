import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { healthInsurancePageTitleUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['health-insurance--prescription-title'];
const INPUT_LABEL = content['health-insurance--prescription-label'];
const HINT_TEXT = content['health-insurance--prescription-hint'];

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
