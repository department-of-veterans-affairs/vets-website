import environment from 'platform/utilities/environment';
import {
  titleUI,
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import fileUploadUI from 'platform/forms-system/src/js/definitions/file';

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

const marriageCertUI = fileInputUI({
  title: 'Upload a copy of your marriage certificate',
  fileUploadUrl: `${environment.API_URL}/v0/evidence_documents`,
  maxFileSize: MAX_FILE_SIZE_BYTES,
  hint:
    'You can upload a .pdf, .jpeg, or .png file. Your file should be no larger than 25MB',
});

export default {
  title: 'Marriage certificate',
  path: 'marriage-certificate',
  uiSchema: {
    ...titleUI('Marriage certificate'),
    marriageCertificate: fileInputUI({
      title: 'Upload a copy of your marriage certificate',
      fileUploadUrl: `${environment.API_URL}/v0/evidence_documents`,
      maxFileSize: MAX_FILE_SIZE_BYTES,
      hint:
        'You can upload a .pdf, .jpeg, or .png file. Your file should be no larger than 25MB',
    }),
    // marriageCertificate: fileUploadUI('', {
    //   fileUploadUrl: `${environment.API_URL}/v0/evidence_documents`,
    //   maxSize: MAX_FILE_SIZE_BYTE
    //   fileTypes: ['pdf', 'jpg', 'jpeg', 'png'],
    //   fileUploadNetworkErrorMessage:
    //     'We’re sorry. There was a problem uploading your file. Please try again.',
    //   fileUploadNetworkErrorAlert: {
    //     header: 'We couldn’t upload your file',
    //     body: [
    //       'We’re sorry. There was a problem with our system and we couldn’t upload your file. Try uploading your file again.',
    //       'Or select Continue to fill out the rest of your form. And then follow the instructions at the end to learn how to submit your documents.',
    //     ],
    //   },
    // }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:marriageCertificateDescription': {
        type: 'object',
        properties: {},
      },
      marriageCertificate: fileInputSchema,
      // marriageCertificate: {
      //   type: 'array',
      //   items: {
      //     type: 'object',
      //     properties: {
      //       name: { type: 'string' },
      //       size: { type: 'integer' },
      //       confirmationCode: { type: 'string' },
      //     },
      //   },
      // },
    },
  },
};
