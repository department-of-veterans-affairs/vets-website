import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Standing with the bar',
  path: 'standing-with-bar',
  uiSchema: {
    ...titleUI('Law license'),
    standingWithBar: yesNoUI(
      'Are you currently an active member in good standing of the bar of the highest court of a state or territory of the United States?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      standingWithBar: yesNoSchema,
    },
    required: ['standingWithBar'],
  },
};
