import { textUI } from 'platform/forms-system/src/js/web-component-patterns';
import { medicarePageTitleUI } from '../../helpers/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--mbi-label'];
const DESC_TEXT = content['medicare--mbi-description'];
const HINT_TEXT = content['medicare--mbi-hint'];

const ERR_MSG_PATTERN = content['validation--mbi-invalid'];
const ERR_MSG_REQUIRED = content['validation--required'];

const MBI_SCHEMA = {
  type: 'string',
  maxLength: 11,
  minLength: 11,
  pattern: '^[0-9a-zA-Z]+$',
};

export default {
  uiSchema: {
    ...medicarePageTitleUI(TITLE_TEXT, DESC_TEXT),
    medicareNumber: textUI({
      title: TITLE_TEXT,
      hint: HINT_TEXT,
      errorMessages: {
        pattern: ERR_MSG_PATTERN,
        required: ERR_MSG_REQUIRED,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['medicareNumber'],
    properties: {
      medicareNumber: MBI_SCHEMA,
    },
  },
};
