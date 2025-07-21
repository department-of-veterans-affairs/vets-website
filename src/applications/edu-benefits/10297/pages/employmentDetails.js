import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your employment'),
  isInTechnologyIndustry: {
    ...yesNoUI({
      title: 'Do you currently work in the technology industry?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
};
const schema = {
  type: 'object',
  required: ['isInTechnologyIndustry'],
  properties: {
    isInTechnologyIndustry: yesNoSchema,
  },
};
export { schema, uiSchema };
