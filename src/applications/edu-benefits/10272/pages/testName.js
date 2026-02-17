import {
  titleUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

const uiSchema = {
  ...titleUI(
    "Tell us about the licensing or certification test you're preparing for",
  ),
  testName: textUI({
    title:
      "What's the name of the licensing or certification test this course helps you prepare for?",
    hint:
      'Type the full name of the test. Your prep course must prepare you for this test to be eligible for reimbursement.',
    errorMessages: {
      required: 'Enter a test name',
    },
    validations: [validateWhiteSpace],
  }),
};

const schema = {
  type: 'object',
  properties: {
    testName: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['testName'],
};

export { schema, uiSchema };
