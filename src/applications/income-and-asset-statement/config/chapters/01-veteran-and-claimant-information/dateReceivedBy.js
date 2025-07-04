import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Reporting period',
  path: 'claimant/has-reporting-period',
  uiSchema: {
    title: 'Reporting period',
    dateReceivedByVa: yesNoUI({
      title:
        'Are you submitting an initial application for Veterans Pension or Parents’ DIC, or are you already receiving these benefits?',
      labelHeaderLevel: '1',
      labels: {
        Y: 'I’m applying for Veterans Pension or Parents’ DIC benefits',
        N: 'I’m already receiving Veterans Pension or Parents’ DIC benefits',
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
