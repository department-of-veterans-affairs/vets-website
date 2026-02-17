import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { validateWhiteSpace } from 'platform/forms/validations';

const uiSchema = {
  ...titleUI('The name of the prep course'),
  prepCourseName: {
    ...textUI({
      title: 'Enter the name of the prep course',
      hint: 'Enter the full name of the prep course you took or plan to take. You can only list one prep course per request.',
      validations: [validateWhiteSpace],
      errorMessages: {
        required: 'Enter a prep course name',
      },
      required: () => true,
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    prepCourseName: textSchema,
  },
  required: ['prepCourseName'],
};

export { schema, uiSchema };
