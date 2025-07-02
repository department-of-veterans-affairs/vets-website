import environment from 'platform/utilities/environment';
import {
  titleUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

export default {
  title: 'Divorce documents',
  // path: 'divorce-documents',
  depends: formData => formData?.maritalStatus === 'DIVORCED',
  uiSchema: {
    ...titleUI('Divorce documents'),
    divorceDocument: fileInputUI({
      title:
        'Upload a copy of your divorce documents. This could include your divorce certificate, decree, or other official document.',
      fileUploadUrl: `${environment.API_URL}/v0/evidence_documents`,
      maxFileSize: MAX_FILE_SIZE_BYTES,
      required: false,
      // hint:
      // 'You can upload a .pdf, .jpeg, or .png file. Your file should be no larger than 25MB',
    }),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      divorceDocument: fileInputSchema,
    },
  },
};
