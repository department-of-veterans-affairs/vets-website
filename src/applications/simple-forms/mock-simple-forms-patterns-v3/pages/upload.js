import {
  fileInputUI,
  fileInputSchema,
  selectUI,
  selectSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Upload a file'),
    uploadedFile: fileInputUI({
      title: 'Your document',
      required: true,
      accept: '.png,.pdf,.txt,.jpg,.jpeg',
      hint: 'Upload a file that is between 1B and 100MB',
      headerSize: '4',
      formNumber: '31-4159',
      skipUpload: true,
      maxFileSize: 1024 * 1024 * 100, // 100MB
      minFileSize: 1, // 1B
    }),
    documentStatus: selectUI({
      title: 'Document status',
      labels: {
        tax: 'Tax form',
        education: 'Education form',
        service: 'Service form',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      uploadedFile: fileInputSchema(),
      documentStatus: selectSchema(['tax', 'education', 'service']),
    },
    required: ['uploadedFile', 'documentStatus'],
  },
};
