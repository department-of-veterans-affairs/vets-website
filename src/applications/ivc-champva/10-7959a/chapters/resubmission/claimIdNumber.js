import {
  descriptionUI,
  selectSchema,
  selectUI,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ClaimIdentificationInfo from '../../components/FormDescriptions/ClaimIdentificationInfo';
import { blankSchema } from '../../definitions';
import content from '../../locales/en/content.json';
import { titleWithRoleUI } from '../../utils/titles';
import { validateChars } from '../../utils/validation';

const TITLE_TEXT = content['resubmission-id-number--page-title'];
const DESC_TEXT = content['resubmission-id-number--page-desc'];

const INPUT_LABELS = {
  select: content['resubmission-id-number--select-label'],
  text: content['resubmission-id-number--input-label'],
};
const INPUT_HINT_TEXT = content['resubmission-id-number--input-hint'];

export const ID_NUMBER_OPTIONS = [
  content['resubmission-id-number--pdi-option'],
  content['resubmission-id-number--control-option'],
];

export default {
  uiSchema: {
    ...titleWithRoleUI(TITLE_TEXT, DESC_TEXT),
    pdiOrClaimNumber: selectUI(INPUT_LABELS.select),
    identifyingNumber: textUI({
      title: INPUT_LABELS.text,
      hint: INPUT_HINT_TEXT,
      validations: [validateChars],
    }),
    'view:addtlInfo': descriptionUI(ClaimIdentificationInfo),
  },
  schema: {
    type: 'object',
    required: ['pdiOrClaimNumber', 'identifyingNumber'],
    properties: {
      pdiOrClaimNumber: selectSchema(ID_NUMBER_OPTIONS),
      identifyingNumber: textSchema,
      'view:addtlInfo': blankSchema,
    },
  },
};
