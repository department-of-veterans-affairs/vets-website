import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import RemarriageProofDescription from '../../components/FormDescriptions/RemarriageProofDescription';
import { ATTACHMENT_IDS } from '../../constants';
import { fileUploadSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--remarriage-proof-title'];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    ...descriptionUI(RemarriageProofDescription),
    applicantRemarriageCert: fileUploadUI({
      label: TITLE_TEXT,
      attachmentId: ATTACHMENT_IDS.marriageCert,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantRemarriageCert'],
    properties: {
      applicantRemarriageCert: fileUploadSchema,
    },
  },
};
