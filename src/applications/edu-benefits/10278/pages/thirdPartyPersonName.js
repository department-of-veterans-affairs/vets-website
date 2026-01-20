import {
  titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  thirdPartyPersonName: {
    ...titleUI('Name of person'),
    fullName: {
      ...fullNameNoSuffixUI(),
      first: {
        ...fullNameNoSuffixUI().first,
        'ui:title': 'First name',
      },
      last: {
        ...fullNameNoSuffixUI().last,
        'ui:title': 'Last name',
      },
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    thirdPartyPersonName: {
      type: 'object',
      properties: {
        fullName: fullNameNoSuffixSchema,
      },
      required: ['fullName'],
    },
  },
};

export { uiSchema, schema };
