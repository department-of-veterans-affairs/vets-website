import {
  titleUI,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Value of additional land'),
  additionalLandValue: currencyUI({
    title: 'What’s the value of the land that’s more than 2 acres?',
    hint: 'Don’t include the value of the residence or the first 2 acres',
  }),
};

const schema = {
  type: 'object',
  required: ['additionalLandValue'],
  properties: {
    additionalLandValue: currencySchema,
  },
};

export default {
  uiSchema,
  schema,
};
