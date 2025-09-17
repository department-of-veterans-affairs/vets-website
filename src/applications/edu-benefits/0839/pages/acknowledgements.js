import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI(
    'Initial each statement to acknowledge the Yellow Ribbon Program terms',
  ),
};

const schema = {
  type: 'object',
  properties: {},
};

export { uiSchema, schema };
