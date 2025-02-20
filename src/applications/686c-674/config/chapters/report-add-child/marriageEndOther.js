import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export const marriageEndOther = {
  uiSchema: {
    ...titleUI({
      title: 'How and when marriage ended',
    }),
    marriageEndDescription: {
      ...textUI('Briefly describe how the marriage ended'),
      'ui:required': (formData, index) =>
        formData?.childrenToAdd?.[index]?.marriageEndReason === 'other' ||
        formData?.marriageEndReason === 'other',
      'ui:errorMessages': {
        required: 'Provide details on how the marriage ended.',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      marriageEndDescription: textSchema,
    },
  },
};
