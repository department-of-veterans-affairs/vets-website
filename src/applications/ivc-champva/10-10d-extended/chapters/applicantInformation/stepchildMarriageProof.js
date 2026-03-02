import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import StepchildMarriageProofDescription from '../../components/FormDescriptions/StepchildMarriageProofDescription';
import { ATTACHMENT_IDS } from '../../utils/constants';
import { attachmentSchema, attachmentUI } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--marriage-proof-title'];
const INPUT_LABEL = content['applicants--marriage-proof-label'];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    ...descriptionUI(StepchildMarriageProofDescription),
    applicantStepMarriageCert: attachmentUI({
      label: INPUT_LABEL,
      attachmentId: ATTACHMENT_IDS.marriageCert,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantStepMarriageCert'],
    properties: {
      applicantStepMarriageCert: attachmentSchema,
    },
  },
};
