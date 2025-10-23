import {
  arrayBuilderItemFirstPageTitleUI,
  fullNameNoSuffixSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const noSpaceOnlyPattern = '^(?!\\s*$).+';

const uiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({
    title: 'Tell us about your read-only school certifying official',
  }),

  fullName: {
    first: textUI({
      title: 'First name of read-only school certifying official',
      errorMessages: {
        required: 'Enter a first name',
        pattern: 'You must provide a response',
      },
    }),
    middle: textUI({
      title: 'Middle name of read-only school certifying official',
    }),
    last: textUI({
      title: 'Last name of read-only school certifying official',
      errorMessages: {
        required: 'Enter a last name',
        pattern: 'You must provide a response',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    fullName: {
      ...fullNameNoSuffixSchema,
      properties: {
        ...fullNameNoSuffixSchema.properties,
        first: {
          ...fullNameNoSuffixSchema.properties.first,
          pattern: noSpaceOnlyPattern,
        },
        last: {
          ...fullNameNoSuffixSchema.properties.last,
          pattern: noSpaceOnlyPattern,
        },
      },
    },
  },
  required: ['fullName'],
};

export { uiSchema, schema };
