import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const INPUT_LABEL = 'Does the beneficiary receive CHAMPVA benefits now?';
const PAGE_TITLE = ({ formData }) =>
  `${
    formData.certifierRole === 'applicant' ? 'Your' : 'Beneficiary’s'
  } CHAMPVA benefit status`;

export default {
  uiSchema: {
    ...titleUI(PAGE_TITLE),
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
