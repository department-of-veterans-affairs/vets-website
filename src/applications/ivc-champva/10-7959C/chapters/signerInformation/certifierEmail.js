import {
  emailSchema,
  emailUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['signer--email-title'];

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    certifierEmail: emailUI(),
  },
  schema: {
    type: 'object',
    required: ['certifierEmail'],
    properties: {
      certifierEmail: emailSchema,
    },
  },
};
