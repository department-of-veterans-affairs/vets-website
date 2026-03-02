import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Land lot size'),
  homeAcreageMoreThanTwo: yesNoUI({
    title:
      "Is your home located on a lot of land that's more than 2 acres (or 87,120 square feet)?",
    'ui:required': true,
  }),
};

const schema = {
  type: 'object',
  required: ['homeAcreageMoreThanTwo'],
  properties: {
    homeAcreageMoreThanTwo: yesNoSchema,
  },
};

export default {
  uiSchema,
  schema,
};
