import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Add an income source'),
};

const schema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema,
  schema,
};
