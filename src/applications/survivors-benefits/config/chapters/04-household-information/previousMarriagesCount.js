import {
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Previous marriages to report'),
    spouseAdditionalMarriagesCount: {
      ...numberUI({
        title: 'How many additional marriages to report?',
        min: 0,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['spouseAdditionalMarriagesCount'],
    properties: {
      spouseAdditionalMarriagesCount: numberSchema,
    },
  },
};
