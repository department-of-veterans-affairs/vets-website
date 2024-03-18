import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Current employment'),
    currentEmployment: yesNoUI({
      title: 'Are you currently employed?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['currentEmployment'],
    properties: {
      currentEmployment: yesNoSchema,
    },
  },
};
