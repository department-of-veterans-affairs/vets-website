import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

export const uiSchema = {
  hasTrainingPay: yesNoUI({
    title: 'Do you expect to receive active or inactive duty training pay?',
  }),
};

export const schema = {
  type: 'object',
  required: ['hasTrainingPay'],
  properties: {
    hasTrainingPay: yesNoSchema,
  },
};
