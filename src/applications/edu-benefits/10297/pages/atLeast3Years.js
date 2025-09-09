import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your Veteran status'),
  veteranStatus: yesNoUI({
    title:
      'Are you a Veteran who has completed 3 years (36 months) of active duty?',
    errorMessages: {
      required: 'Please select an option',
    },
  }),
};
const schema = {
  type: 'object',
  properties: {
    veteranStatus: yesNoSchema,
  },
  required: ['veteranStatus'],
};

export { uiSchema, schema };
