import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['sponsor--living-status-title'];
const DESC_TEXT = content['sponsor--living-status-description'];
const INPUT_LABEL = content['sponsor--living-status-label'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT, DESC_TEXT),
    sponsorIsDeceased: yesNoUI(INPUT_LABEL),
  },
  schema: {
    type: 'object',
    required: ['sponsorIsDeceased'],
    properties: {
      sponsorIsDeceased: yesNoSchema,
    },
  },
};
