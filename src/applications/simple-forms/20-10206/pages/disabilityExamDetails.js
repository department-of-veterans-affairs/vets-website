import {
  titleUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayStackUI,
  arrayStackSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Claim exam details',
      'You requested access to your claim exams (sometimes called disability examinations or C&P exams). Any extra information you can share will help us find your records.',
    ),
    disabilityExams: arrayStackUI({
      nounSingular: 'exam date',
      fields: {
        disabilityExamDate: currentOrPastDateUI({
          title: 'When was your exam?',
          hint: 'It\u2019s OK to estimate.',
          invalidDay: false,
          errorMessages: {
            pattern: 'Enter a valid exam date',
            required: 'Enter your exam date',
          },
        }),
      },
      text: {
        deleteDescription:
          'This will remove the date of your claim exam and may make it harder to find your record.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      disabilityExams: arrayStackSchema({
        fields: { disabilityExamDate: currentOrPastDateSchema },
        maxItems: 5,
      }),
    },
  },
};
