import {
  titleUI,
  textUI,
  textSchema,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { validateWhiteSpace } from 'platform/forms/validations';

export default {
  uiSchema: {
    ...titleUI('Program information'),
    programName: {
      ...textUI({
        title: 'Name of degree program',
        validations: [validateWhiteSpace],
        errorMessages: {
          required: 'Enter the name of the degree program',
        },
      }),
    },
    totalProgramLength: {
      ...textUI({
        title: 'Total length of program',
        validations: [validateWhiteSpace],
        errorMessages: {
          required: 'Enter the total length of the program',
        },
      }),
    },
    weeksPerTerm: {
      ...numberUI({
        title: 'Number of weeks per term/semester',
        min: 0,
        max: 100,
        errorMessages: {
          required: 'Enter the number of weeks per term/semester',
        },
      }),
    },
    entryRequirements: {
      ...textUI({
        title: 'Entry requirements',
        validations: [validateWhiteSpace],
        errorMessages: {
          required: 'List the entry requirements',
        },
      }),
    },
    creditHours: {
      ...numberUI({
        title: 'Credit hours',
        min: 0,
        max: 10000,
        errorMessages: {
          required: 'Enter the number of credit hours ',
        },
      }),
    },
  },

  schema: {
    type: 'object',
    properties: {
      programName: { ...textSchema, maxLength: 200 },
      totalProgramLength: { ...textSchema, maxLength: 100 },
      weeksPerTerm: numberSchema,
      entryRequirements: { ...textSchema, maxLength: 1000 },
      creditHours: {
        type: 'string',
        pattern: '^\\d+(\\.\\d{0,2})?$', // digits, optionally with a decimal and 0, 1, or 2 numbers after the decimal
      },
    },
    required: [
      'programName',
      'totalProgramLength',
      'weeksPerTerm',
      'entryRequirements',
      'creditHours',
    ],
  },
};
