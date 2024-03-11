import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Medicaid coverage'),
    medicaidCoverage: yesNoUI({
      title: 'Does Medicaid cover all or part of your nursing home costs?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      medicaidCoverage: yesNoSchema,
    },
  },
};
