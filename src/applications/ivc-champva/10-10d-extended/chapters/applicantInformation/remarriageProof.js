import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import RemarriageProofDescription from '../../components/FormDescriptions/RemarriageProofDescription';
import { ATTACHMENT_IDS } from '../../constants';
import { attachmentSchema, attachmentUI } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--remarriage-proof-title'];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    ...descriptionUI(RemarriageProofDescription),
    applicantRemarriageCert: attachmentUI({
      label: TITLE_TEXT,
      attachmentId: ATTACHMENT_IDS.marriageCert,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantRemarriageCert'],
    properties: {
      applicantRemarriageCert: attachmentSchema,
    },
  },
};
