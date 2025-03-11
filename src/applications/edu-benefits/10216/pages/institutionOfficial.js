import {
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const uiSchema = {
  certifyingOfficial: {
    ...titleUI('Tell us about yourself'),
    first: {
      ...textUI({
        title: 'First name',
        errorMessages: {
          required: 'First name is required',
        },
      }),
    },
    last: {
      ...textUI({
        title: 'Last name',
        errorMessages: { required: 'Last name is required' },
      }),
    },
    title: textUI({
      title: 'Your title',
      errorMessages: { required: 'Please enter a title' },
    }),
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

export const certifyingOfficial = { uiSchema, schema };
