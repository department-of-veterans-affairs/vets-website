import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  'ui:title': 'Your work history',
  questions: {
    vetHasAdditionalEmployment: yesNoUI({
      title:
        'Do you make monthly payments on any installment contracts or other debts you make monthly payments on?',
      enableAnalytics: true,
      uswds: true,
      required: () => true,
      errorMessages: {
        required: 'Please enter your employment information.',
      },
    }),
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        vetHasAdditionalEmployment: yesNoSchema,
      },
    },
  },
};
