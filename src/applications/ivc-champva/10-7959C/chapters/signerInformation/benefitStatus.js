import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithRoleUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['signer--benefit-status-title'];
const INPUT_LABEL = content['signer--benefit-status-label'];

export default {
  uiSchema: {
    ...titleWithRoleUI(TITLE_TEXT),
    champvaBenefitStatus: yesNoUI(INPUT_LABEL),
  },
  schema: {
    type: 'object',
    required: ['champvaBenefitStatus'],
    properties: {
      champvaBenefitStatus: yesNoSchema,
    },
  },
};
