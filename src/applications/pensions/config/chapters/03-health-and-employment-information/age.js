import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    isOver65: yesNoUI({
      title: 'Are you 65 years old or older?',
      uswds: true,
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
