import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Land lot size'),
  landLotSize: yesNoUI({
    title:
      "Is your home located on a lot of land that's more than 2 acres (or 87,120 square feet)?",
    'ui:required': true,
  }),
};

const schema = {
  type: 'object',
  required: ['landLotSize'],
  properties: {
    landLotSize: yesNoSchema,
  },
};

export default {
  uiSchema,
  schema,
};
