import {
  numberUI,
  textUI,
  textSchema,
  numberSchema,
  arrayBuilderItemFirstPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const programInfo = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Program Information',
      nounSingular: 'program',
    }),
    programName: textUI('Program name'),
    studentsEnrolled: numberUI({
      title: 'Total number of students enrolled',
    }),
    supportedStudents: numberUI({
      title: 'Total number of supported students enrolled',
    }),
    fte: {
      supported: numberUI({
        title: 'Number of supported students FTE',
      }),
      nonSupported: numberUI({
        title: 'Number of non-supported students FTE',
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      programName: textSchema,
      studentsEnrolled: numberSchema,
      supportedStudents: numberSchema,
      fte: {
        type: 'object',
        properties: {
          supported: numberSchema,
          nonSupported: numberSchema,
          // totalEnrolledFTE: numberSchema,
        },
      },
    },
    required: ['programName', 'studentsEnrolled', 'supportedStudents'],
  },
};
