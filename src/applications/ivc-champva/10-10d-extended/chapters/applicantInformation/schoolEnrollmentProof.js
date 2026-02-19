import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import SchoolEnrollmentProofDescription from '../../components/FormDescriptions/SchoolEnrollmentProofDescription';
import { ATTACHMENT_IDS } from '../../utils/constants';
import { attachmentUI, attachmentWithMetadataSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['applicants--school-enrollment-proof-title'];

const SCHEMA_ENUM = [
  ATTACHMENT_IDS.schoolCertificationForm,
  ATTACHMENT_IDS.schoolEnrollmentLetter,
];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    ...descriptionUI(SchoolEnrollmentProofDescription),
    applicantSchoolCert: attachmentUI({
      label: TITLE_TEXT,
      attachmentId: ATTACHMENT_IDS.schoolCertificationForm,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantSchoolCert'],
    properties: {
      applicantSchoolCert: attachmentWithMetadataSchema({
        enumNames: SCHEMA_ENUM,
      }),
    },
  },
};
