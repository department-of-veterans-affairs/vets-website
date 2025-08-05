import {
  fileInputUI,
  fileInputSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3FileInput: fileInputUI({
      title: 'Web component v3 file input',
      required: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3FileInput: fileInputSchema(),
    },
  },
};
