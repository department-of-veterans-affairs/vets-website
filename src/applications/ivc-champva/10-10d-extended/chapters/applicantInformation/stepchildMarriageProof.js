import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import StepchildMarriageProofDescription from '../../components/FormDescriptions/StepchildMarriageProofDescription';
import { ATTACHMENT_IDS } from '../../constants';
import { fileUploadSchema } from '../../definitions';
import content from '../../locales/en/content.json';

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      content['applicants--marriage-proof-title'],
    ),
    ...descriptionUI(StepchildMarriageProofDescription),
    applicantStepMarriageCert: fileUploadUI({
      label: content['applicants--marriage-proof-label'],
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
