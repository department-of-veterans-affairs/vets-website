import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import StepchildMarriageProofDescription from '../../components/FormDescriptions/StepchildMarriageProofDescription';
import { ATTACHMENT_IDS } from '../../constants';
import { fileUploadSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--marriage-proof-title'];
const INPUT_LABEL = content['applicants--marriage-proof-label'];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    ...descriptionUI(StepchildMarriageProofDescription),
    applicantStepMarriageCert: fileUploadUI({
      label: INPUT_LABEL,
      attachmentId: ATTACHMENT_IDS.marriageCert,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantStepMarriageCert'],
    properties: {
      applicantStepMarriageCert: fileUploadSchema,
    },
  },
};
