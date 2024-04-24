import {
  ssnOrVaFileNumberUI,
  ssnOrVaFileNumberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Web component v3'),
    wcv3SsnNew: ssnOrVaFileNumberUI(),
  },
  schema: {
    type: 'object',
    properties: {
      wcv3SsnNew: ssnOrVaFileNumberSchema,
    },
    required: ['wcv3SsnNew'],
  },
  initialData: {},
};
