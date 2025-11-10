import {
  titleUI,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Total assets'),
  totalAssets: currencyUI({
    title: 'Estimate the total value of your assets',
  }),
};

const schema = {
  type: 'object',
  required: ['totalAssets'],
  properties: {
    totalAssets: currencySchema,
  },
};

export default {
  uiSchema,
  schema,
};
