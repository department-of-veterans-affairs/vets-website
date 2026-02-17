import environment from 'platform/utilities/environment';
import {
  titleUI,
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI(
      'Submit supporting documents',
      'This may include legal documents, bills, or other documentation of expenses',
    ),
    veteranSupportingDocuments: fileInputMultipleUI({
      title: 'Supporting documents',
      required: false,
      hint: 'Upload a file that is between 1KB and 5MB.',
      formNumber: '21P-601',
      disallowEncryptedPdfs: true,
      fileUploadUrl: `${environment.API_URL}/simple_forms_api/v1/simple_forms/submit_supporting_documents`,
      maxFileSize: 1024 * 1024 * 5,
      minFileSize: 1,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranSupportingDocuments: fileInputMultipleSchema(),
    },
  },
};
