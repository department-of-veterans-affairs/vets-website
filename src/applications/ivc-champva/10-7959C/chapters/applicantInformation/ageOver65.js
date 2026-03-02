import {
  descriptionUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import BeneficiaryAgeAddtlInfo from '../../components/FormDescriptions/BeneficiaryAgeAddtlInfo';
import { titleWithNameUI } from '../../utils/titles';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicant--age-title'];
const INPUT_LABEL = content['applicant--age-label'];
const HINT_TEXT = content['applicant--age-hint'];

const SCHEMA_LABELS = {
  Y: content['applicant--age-option--yes'],
  N: content['applicant--age-option--no'],
};

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    'view:applicantAgeOver65': yesNoUI({
      title: INPUT_LABEL,
      hint: HINT_TEXT,
      labels: SCHEMA_LABELS,
    }),
    'view:addtlInfo': descriptionUI(BeneficiaryAgeAddtlInfo),
  },
  schema: {
    type: 'object',
    required: ['view:applicantAgeOver65'],
    properties: {
      'view:applicantAgeOver65': yesNoSchema,
      'view:addtlInfo': blankSchema,
    },
  },
};
