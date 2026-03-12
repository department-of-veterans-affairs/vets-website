import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Supporting documents'),
    supportingDocuments: fileInputMultipleUI({
      title: 'Supporting documents',
      required: true,
      accept: '.png,.pdf,.txt,.jpg,.jpeg',
      hint: 'Upload a file that is between 1B and 100MB',
      headerSize: '4',
      formNumber: '31-4159',
      skipUpload: true,
      maxFileSize: 1024 * 1024 * 100, // 100MB
      minFileSize: 1, // 1B
    }),
  },
  schema: {
    type: 'object',
    properties: {
      supportingDocuments: fileInputMultipleSchema(),
    },
  },
};
