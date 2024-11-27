import {
  numberUI,
  numberSchema,
  textUI,
  textSchema,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

export const programInfo = {
  uiSchema: {
    ...titleUI('Program Information'),
    name: textUI('Program Name'),
    studentsEnrolled: numberUI({
      title: 'Total number of students enrolled',
      // hint: 'Please enter a valid number between 1 and 99',
      min: 1,
      max: 100000,
      required: true,
    }),
    supportedStudents: numberUI({
      title: 'Total number of supported students enrolled',
      // hint: 'Please enter a valid number between 1 and 99',
      min: 1,
      max: 100000,
      required: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      studentsEnrolled: numberSchema,
      supportedStudents: numberSchema,
    },
    required: ['name', 'studentsEnrolled', 'supportedStudents'],
  },
};
