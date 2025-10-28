import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI({
    title: 'Enter a point of contact for this location',
  }),
  fullName: fullNameNoSuffixUI(),
};

const schema = {
  type: 'object',
  properties: {
    fullName: fullNameNoSuffixSchema,
  },
  required: ['fullName'],
};

export { uiSchema, schema };
