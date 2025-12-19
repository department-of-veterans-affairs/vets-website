import {
  titleUI,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Total assets'),
  netWorthEstimation: currencyUI({
    title: 'Estimate the total value of your assets',
  }),
};

const schema = {
  type: 'object',
  required: ['netWorthEstimation'],
  properties: {
    netWorthEstimation: currencySchema,
  },
};

export default {
  uiSchema,
  schema,
};
