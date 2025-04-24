import {
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const uiSchema = {
  certifyingOfficial: {
    ...titleUI('Your name and title'),
    first: {
      ...textUI({
        title: 'First name',
        hint: '',
        errorMessages: {
          required: 'First name is required',
        },
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        hint: '',
        errorMessages: {
          required: 'Last name is required',
        },
      }),
    },
    title: {
      ...textUI({
        title: 'Your title',
        hint: '',
        errorMessages: {
          required: 'Please enter a title',
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
        first: textSchema,
        last: textSchema,
        title: textSchema,
      },
      required: ['first', 'last', 'title'],
    },
  },
};

export { uiSchema, schema };
