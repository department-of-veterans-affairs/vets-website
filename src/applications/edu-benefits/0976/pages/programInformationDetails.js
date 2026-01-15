import {
  titleUI,
  textUI,
  textSchema,
  numberUI,
  numberSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Program information'),
    programName: {
      ...textUI({
        title: 'Name of degree program',
        errorMessages: {
          required: 'Enter the name of the degree program',
        },
      }),
    },
    totalProgramLength: {
      ...textUI({
        title: 'Total length of program',
        errorMessages: {
          required: 'Enter the total length of the program',
        },
      }),
    },
    weeksPerTerm: {
      ...numberUI({
        title: 'Number of weeks per term/semester',
        min: 0,
        errorMessages: {
          required: 'Enter the number of weeks per term/semester',
        },
      }),
    },
    entryRequirements: {
      ...textUI({
        title: 'Entry requirements',
        errorMessages: {
          required: 'List the entry requirements',
        },
      }),
    },
    creditHours: {
      ...numberUI({
        title: 'Credit hours',
        min: 0,
        errorMessages: {
          required: 'Enter the number of credit hours ',
        },
      }),
    },
  },

  schema: {
    type: 'object',
    properties: {
      programName: textSchema,
      totalProgramLength: textSchema,
      weeksPerTerm: numberSchema,
      entryRequirements: textSchema,
      creditHours: numberSchema,
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
