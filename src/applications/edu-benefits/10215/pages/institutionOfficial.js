import {
  textSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns/textPatterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const uiSchema = {
  certifyingOfficial: {
    ...titleUI('Tell us about yourself'),
    first: {
      ...textUI('First name'),
      'ui:required': () => true,
    },
    last: {
      ...textUI('Last name'),
      'ui:required': () => true,
    },
    title: textUI('Your title'),
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
