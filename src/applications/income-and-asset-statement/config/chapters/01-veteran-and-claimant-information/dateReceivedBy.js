import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Initial application or receiving benefits',
  path: 'claimant/has-reporting-period',
  uiSchema: {
    title: 'Reporting period',
    dateReceivedByVa: yesNoUI({
      title: 'Which of these best describe your case?',
      labelHeaderLevel: '1',
      labels: {
        Y:
          'I’m submitting an initial application for VA Pension or Parents’ DIC benefits',
        N: 'I’m already receiving VA Pension or Parents’ DIC benefits',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['dateReceivedByVa'],
    properties: {
      dateReceivedByVa: yesNoSchema,
    },
  },
};
