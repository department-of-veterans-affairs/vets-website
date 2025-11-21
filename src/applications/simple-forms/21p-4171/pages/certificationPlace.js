import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Place of certification'),
    certificationPlace: textUI('Place where statement was made'),
  },
  schema: {
    type: 'object',
    properties: {
      certificationPlace: textSchema,
    },
    required: [],
  },
};
