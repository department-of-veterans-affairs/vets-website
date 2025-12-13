import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { healthInsurancePageTitleUI } from '../../utils/titles';

const TITLE_TEXT = 'Type of insurance for %s';
const INPUT_LABEL = 'Is this insurance through the beneficiary’s employer?';

export default {
  uiSchema: {
    ...healthInsurancePageTitleUI(TITLE_TEXT),
    throughEmployer: yesNoUI(INPUT_LABEL),
  },
  schema: {
    type: 'object',
    required: ['throughEmployer'],
    properties: {
      throughEmployer: yesNoSchema,
    },
  },
};
