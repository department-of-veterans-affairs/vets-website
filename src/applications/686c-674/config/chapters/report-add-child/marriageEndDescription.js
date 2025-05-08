import {
  titleUI,
  textUI,
  textSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

export const marriageEndDescription = {
  uiSchema: {
    ...titleUI({
      title: 'How and when marriage ended',
    }),
    marriageEndDescription: {
      ...textUI('Briefly describe how the marriage ended'),
      'ui:errorMessages': {
        required: 'Provide details on how the marriage ended.',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageEndDescription'],
    properties: {
      marriageEndDescription: textSchema,
    },
  },
};
