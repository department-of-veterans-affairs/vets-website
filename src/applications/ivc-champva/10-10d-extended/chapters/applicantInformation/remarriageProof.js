import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import RemarriageProofDescription from '../../components/FormDescriptions/RemarriageProofDescription';
import { ATTACHMENT_IDS } from '../../constants';
import { fileUploadSchema } from '../../definitions';
import content from '../../locales/en/content.json';

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      content['applicants--remarriage-proof-title'],
    ),
    ...descriptionUI(RemarriageProofDescription),
    applicantRemarriageCert: fileUploadUI({
      label: content['applicants--remarriage-proof-title'],
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
