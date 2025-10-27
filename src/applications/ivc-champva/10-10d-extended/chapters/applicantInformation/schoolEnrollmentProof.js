import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { fileUploadUi as fileUploadUI } from '../../../shared/components/fileUploads/upload';
import SchoolEnrollmentProofDescription from '../../components/FormDescriptions/SchoolEnrollmentProofDescription';
import { ATTACHMENT_IDS } from '../../constants';
import { fileUploadWithMetadataSchema } from '../../definitions';
import content from '../../locales/en/content.json';

const ENUM_NAMES = [
  ATTACHMENT_IDS.schoolCertificationForm,
  ATTACHMENT_IDS.schoolEnrollmentLetter,
];

const TITLE_TEXT = content['applicants--school-enrollment-proof-title'];

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(TITLE_TEXT),
    ...descriptionUI(SchoolEnrollmentProofDescription),
    applicantSchoolCert: fileUploadUI({
      label: TITLE_TEXT,
      attachmentId: ATTACHMENT_IDS.schoolCertificationForm,
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantSchoolCert'],
    properties: {
      applicantSchoolCert: fileUploadWithMetadataSchema({
        enumNames: ENUM_NAMES,
      }),
    },
  },
};
