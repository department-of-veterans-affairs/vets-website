import environment from 'platform/utilities/environment';
import {
  titleUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  title: 'Marriage certificate',
  path: 'marriage-certificate',
  uiSchema: {
    ...titleUI('Marriage certificate'),
    marriageCertificate: {
      ...fileInputUI({
        title: 'Upload a copy of your marriage certificate',
        fileUploadUrl: `${environment.API_URL}/v0/evidence_documents`,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:marriageCertificateDescription': {
        type: 'object',
        properties: {},
      },
      marriageCertificate: fileInputSchema,
    },
  },
};
