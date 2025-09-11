import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your employment'),
  isEmployed: {
    ...yesNoUI({
      title: 'Are you currently employed?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    isEmployed: yesNoSchema,
  },
  required: ['isEmployed'],
};
export { schema, uiSchema };
