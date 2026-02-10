// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your VA education benefits'),
  hasPreviouslyApplied: {
    ...yesNoUI({
      title:
        'Have you previously applied and been found eligible for the VA education benefit you want to use?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: () => true,
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    hasPreviouslyApplied: yesNoSchema,
  },
  required: ['hasPreviouslyApplied'],
};

export { schema, uiSchema };
