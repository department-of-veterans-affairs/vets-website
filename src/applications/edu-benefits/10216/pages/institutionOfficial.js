import {
  fullNameSchema,
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const uiSchema = {
  certifyingOfficial: {
    ...titleUI('Your name and title'),
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
        first: fullNameSchema.properties.first,
        last: fullNameSchema.properties.last,
        title: textSchema,
      },
      required: ['first', 'last', 'title'],
    },
  },
};

export const certifyingOfficial = { uiSchema, schema };
