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
        errorMessages: {
          required: 'First name is required',
          pattern: 'You must provide a response',
        },
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        errorMessages: {
          required: 'Last name is required',
          pattern: 'You must provide a response',
        },
      }),
    },
    title: textUI({
      title: 'Your title',
      errorMessages: {
        required: 'Please enter a title',
        pattern: 'You must provide a response',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    certifyingOfficial: {
      type: 'object',
      properties: {
        first: { ...textSchema, pattern: noSpaceOnlyPattern },
        last: { ...textSchema, pattern: noSpaceOnlyPattern },
        title: { ...textSchema, pattern: noSpaceOnlyPattern },
      },
      required: ['first', 'last', 'title'],
    },
  },
};

export const certifyingOfficial = { uiSchema, schema };
