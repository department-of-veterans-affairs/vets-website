import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Ownership of properties with VA home loans'),
    loanHistory: {
      currentOwnership: yesNoUI({
        title: 'Do you still own any property you bought using a VA home loan?',
        description:
          'Include homes, condos, or other property purchased with a VA‑backed mortgage.',
        labels: {
          Y: 'Yes — I still own at least one property',
          N: 'No — I don’t own any anymore',
        },
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      loanHistory: {
        type: 'object',
        properties: {
          currentOwnership: yesNoSchema,
        },
        required: ['currentOwnership'],
      },
    },
  },
};
