import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your VA education benefits'),
  hasPreviouslyApplied: yesNoUI(
    'Have you applied for VA education benefits before?',
  ),
};

const schema = {
  type: 'object',
  properties: {
    hasPreviouslyApplied: yesNoSchema,
  },
  required: ['hasPreviouslyApplied'],
};

export { schema, uiSchema };
