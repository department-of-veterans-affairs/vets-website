import {
  numberUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Previous veteran marriages to report'),
    veteranAdditionalMarriagesCount: {
      ...numberUI({
        title: 'How many additional veteran marriages to report?',
        min: 0,
      }),
    },
  },
  schema: {
    type: 'object',
    required: ['veteranAdditionalMarriagesCount'],
    properties: {
      veteranAdditionalMarriagesCount: numberSchema,
    },
  },
};
