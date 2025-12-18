import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const TITLE_TEXT = 'Your information';
const INPUT_LABEL = 'Which of these best describes you?';
const RADIO_LABELS = {
  applicant: 'I’m filling out this form for myself',
  other:
    'I’m a parent, spouse, or legal representative signing on behalf of the beneficiary',
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    certifierRole: radioUI({
      title: INPUT_LABEL,
      labels: RADIO_LABELS,
    }),
  },
  schema: {
    type: 'object',
    required: ['certifierRole'],
    properties: {
      certifierRole: radioSchema(Object.keys(RADIO_LABELS)),
    },
  },
};
