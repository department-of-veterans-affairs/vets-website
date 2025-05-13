import {
  fileInputMultipleUI,
  fileInputMultipleSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    wcv3FileInputMultiple: fileInputMultipleUI({
      title: 'Web component v3 file input multiple',
      required: false,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3FileInputMultiple: fileInputMultipleSchema,
    },
  },
};
