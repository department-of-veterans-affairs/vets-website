import React from 'react';
import {
  titleUI,
  currencyUI,
  currencySchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const Description = () => (
  <div>
    <p>Don’t include the value of the residence or the first 2 acres</p>
  </div>
);

const uiSchema = {
  ...titleUI('Value of additional land', Description),
  additionalLandValue: currencyUI({
    title: 'What’s the value of the land that’s more than 2 acres?',
    'ui:required': true,
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
