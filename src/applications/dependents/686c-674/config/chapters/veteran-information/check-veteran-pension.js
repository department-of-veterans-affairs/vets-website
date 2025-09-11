import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  'view:checkVeteranPension': yesNoUI({
    title: 'Do you receive Veteran Pension or Survivors benefits?',
    hint:
      "If yes, we'll ask you questions about your dependents' income. If no, we'll skip questions about your dependents' income.",
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
