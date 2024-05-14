import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Age',
  path: 'medical/history/age',
  uiSchema: {
    isOver65: yesNoUI({
      title: 'Are you 65 years old or older?',
      classNames: 'vads-u-margin-bottom--2',
    }),
  },
  schema: {
    type: 'object',
    required: ['isOver65'],
    properties: {
      isOver65: yesNoSchema,
    },
  },
};
