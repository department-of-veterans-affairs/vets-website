import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your technology industry involvement'),
  isInTechnologyIndustry: {
    ...yesNoUI({
      title: 'Do you currently work in the technology industry?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      required: formData => formData.isEmployed === true,
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    isInTechnologyIndustry: yesNoSchema,
  },
};
export { schema, uiSchema };
