// @ts-check
import {
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Name of new school and program'),
    newSchoolName: {
      ...textUI({
        title: 'School name',
        errorMessages: {
          required: 'Enter the name of the school',
        },
        validations: [validateWhiteSpace],
      }),
    },
    newProgramName: {
      ...textUI({
        title: 'Program name',
        errorMessages: {
          required: 'Enter the program name',
        },
        validations: [validateWhiteSpace],
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      newSchoolName: textSchema,
      newProgramName: textSchema,
    },
    required: ['newSchoolName', 'newProgramName'],
  },
};
