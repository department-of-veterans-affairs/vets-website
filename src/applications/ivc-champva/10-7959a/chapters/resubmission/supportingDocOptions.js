import {
  descriptionUI,
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ResubmissionOptionsAddtlInfo from '../../components/FormDescriptions/ResubmissionOptionsAddtlInfo';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['resubmission--dta-docs-title'];
const INPUT_LABEL = content['resubmission--dta-docs-label'];

const SCHEMA_LABELS = {
  Y: content['resubmission--dta-docs-option--yes'],
  N: content['resubmission--dta-docs-option--no'],
};

export default {
  uiSchema: {
    ...titleUI(TITLE_TEXT),
    'view:hasClaimDocs': yesNoUI({
      title: INPUT_LABEL,
      labels: SCHEMA_LABELS,
    }),
    'view:addtlInfo': descriptionUI(ResubmissionOptionsAddtlInfo),
  },
  schema: {
    type: 'object',
    required: ['view:hasClaimDocs'],
    properties: {
      'view:hasClaimDocs': yesNoSchema,
      'view:addtlInfo': blankSchema,
    },
  },
};
