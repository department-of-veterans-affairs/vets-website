import React from 'react';
import {
  titleUI,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const Description = () => (
  <div>
    <p>Estimate the total value of your assets</p>
  </div>
);

const uiSchema = {
  ...titleUI('Total assets', Description),
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
