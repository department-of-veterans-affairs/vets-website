import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Law license',
  path: 'law-license',
  uiSchema: {
    ...titleUI('Law license'),
    lawLicense: yesNoUI(
      'Are you currently an active member in good standing of the bar of the highest court of a state or territory of the United States?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      lawLicense: yesNoSchema,
    },
    required: ['lawLicense'],
  },
};
