import {
  titleUI,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Value of additional land'),
  homeAcreageValue: currencyUI({
    title: 'What’s the value of the land that’s more than 2 acres?',
    hint: 'Don’t include the value of the residence or the first 2 acres',
  }),
};

const schema = {
  type: 'object',
  required: ['homeAcreageValue'],
  properties: {
    homeAcreageValue: currencySchema,
  },
};

export default {
  uiSchema,
  schema,
};
