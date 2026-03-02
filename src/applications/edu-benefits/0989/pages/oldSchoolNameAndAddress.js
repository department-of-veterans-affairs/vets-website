// @ts-check
import {
  addressNoMilitaryUI,
  addressNoMilitarySchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'School name and mailing address',
      'Please provide the name and mailing address of your school that closed, or where your program was withdrawn or suspended.',
    ),
    closedSchoolName: {
      ...textUI({
        title: 'School name',
        errorMessages: {
          required: 'Enter a school name',
        },
        validations: [validateWhiteSpace],
      }),
    },
    closedSchoolAddress: {
      ...addressNoMilitaryUI(),
    },
  },
  schema: {
    type: 'object',
    properties: {
      closedSchoolName: textSchema,
      closedSchoolAddress: addressNoMilitarySchema(),
    },
    required: ['closedSchoolName', 'closedSchoolAddress'],
  },
};
