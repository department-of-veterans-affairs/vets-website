import {
  titleUI,
  textUI,
  textSchema,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Details of your past training'),
    trainingType: textUI({
      title: 'What type of education or training did you receive?',
      charcount: true,
      maxLength: 12,
    }),
    trainingDates: currentOrPastDateRangeUI(
      'Training start date',
      'Training completion date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      trainingType: {
        ...textSchema,
        maxLength: 12,
      },
      trainingDates: currentOrPastDateRangeSchema,
    },
    required: ['trainingType', 'trainingDates'],
  },
};
