import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  'view:checkVeteranPension': yesNoUI({
    title:
      "Are you claiming or do you already receive Veteran Pension or Survivor's Pension benefits?",
    hint:
      "If yes, we'll ask you questions about your dependent's income. If no, we'll skip questions about your dependent's income.",
    hideOnReview: true,
  }),
};

export const schema = {
  type: 'object',
  required: ['view:checkVeteranPension'],
  properties: {
    'view:checkVeteranPension': yesNoSchema,
  },
};
