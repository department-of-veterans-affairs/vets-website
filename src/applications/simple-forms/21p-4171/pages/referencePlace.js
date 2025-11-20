import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Where did this occur'),
    referencePlace: textUI('Place'),
  },
  schema: {
    type: 'object',
    properties: {
      referencePlace: {
        ...textSchema,
        maxLength: 100,
      },
    },
    required: ['referencePlace'],
  },
  depends: formData => formData?.heardReferToEachOther === true,
};
