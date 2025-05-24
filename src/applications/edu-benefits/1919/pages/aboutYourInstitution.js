import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Tell us about your institution'),
  aboutYourInstitution: {
    ...yesNoUI({
      title: 'Has your institution been assigned a facility code?',
      labels: {
        Y: 'Yes',
        N: 'Not yet',
      },
      errorMessages: { required: 'Please provide a response' },
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    aboutYourInstitution: yesNoSchema,
  },
};
export { schema, uiSchema };
