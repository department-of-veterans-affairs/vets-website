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
        Y: 'Yes', // TODO: If yes OR blank, go to next page
        N: 'No', // TODO: If no, skip to page 5
        errorMessages: { required: 'You must provide a response' },
      },
    }),
  },
};
const schema = {
  type: 'object',
  // required: ['isEmployed'],
  properties: {
    isEmployed: yesNoSchema,
  },
};
export { schema, uiSchema };
