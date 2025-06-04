import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Individuals affiliated with both your institution and VA or SAA'),
};

const schema = {
  type: 'object',
  properties: {},
};

export { schema, uiSchema };
