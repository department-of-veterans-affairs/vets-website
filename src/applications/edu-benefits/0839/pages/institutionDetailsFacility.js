import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI("Please enter your institution's facility code"),
};

const schema = {
  type: 'object',
  properties: {},
};

export { uiSchema, schema };
