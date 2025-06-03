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
      errorMessages: {
        required: 'Please provide a response',
      },
      labels: {
        Y: 'Yes',
        N: 'Not yet',
      },
    }),
  },
};
const schema = {
  type: 'object',
  required: ['aboutYourInstitution'],
  properties: {
    aboutYourInstitution: yesNoSchema,
  },
};
export { schema, uiSchema };
