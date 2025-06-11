import {
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const noSpaceOnlyPattern = '^(?!\\s*$).+';
const uiSchema = {
  certifyingOfficial: {
    ...titleUI('Your name and title'),
    first: {
      ...textUI({
        title: 'First name',
        hint: '',
        errorMessages: {
          required: 'First name is required',
          pattern: 'You must provide a response',
        },
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        hint: '',
        errorMessages: {
          required: 'Last name is required',
          pattern: 'You must provide a response',
        },
      }),
    },
    title: {
      ...textUI({
        title: 'Your title',
        hint: '',
        errorMessages: {
          required: 'Please enter a title',
          pattern: 'You must provide a response',
        },
      }),
    },
  },
};

const schema = {
  type: 'object',
  properties: {
    certifyingOfficial: {
      type: 'object',
      properties: {
        first: {
          ...textSchema,
          pattern: noSpaceOnlyPattern,
          maxLength: 30,
        },
        last: {
          ...textSchema,
          pattern: noSpaceOnlyPattern,
          maxLength: 30,
        },
        title: {
          ...textSchema,
          pattern: noSpaceOnlyPattern,
          maxLength: 50,
        },
      },
      required: ['first', 'last', 'title'],
    },
  },
};

export { uiSchema, schema };
