import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    veteranWasMarriedBefore: yesNoSchema,
  },
};

export const uiSchema = {
  ...titleUI('Your marital history'),
  veteranWasMarriedBefore: yesNoUI({
    title: 'Have you been married before?',
    required: () => true,
  }),
};
