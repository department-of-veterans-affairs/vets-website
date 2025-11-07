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
    ...titleUI('Details of your recent training'),
    recentTrainingType: textUI({
      title: 'What type of education or training did you receive?',
      charcount: true,
      maxLength: 12,
    }),
    recentTrainingDates: currentOrPastDateRangeUI(
      'Training start date',
      'Training completion date',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      recentTrainingType: {
        ...textSchema,
        maxLength: 12,
      },
      recentTrainingDates: currentOrPastDateRangeSchema,
    },
    required: ['recentTrainingType', 'recentTrainingDates'],
  },
};
