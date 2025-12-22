import {
  emailSchema,
  emailUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const TITLE_TEXT = 'Your email address';

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
