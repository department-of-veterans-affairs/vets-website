import {
  textUI,
  numberUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  numberSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Employment Statement',

    disabilityDate: currentOrPastDateUI(
      'Date your disability affected full-time employment',
    ),

    lastWorkedDate: currentOrPastDateUI('Date you last worked full-time'),
    disabledWorkDate: currentOrPastDateUI(
      'Date you became too disabled to work',
    ),
    maxYearlyEarnings: numberUI(
      'What is the most you ever earned in one year?',
    ),
    yearEarned: numberUI('What year?'),
    occupation: textUI('Occupation during that year?'),
  },
  schema: {
    type: 'object',
    properties: {
      disabilityDate: currentOrPastDateSchema,
      lastWorkedDate: currentOrPastDateSchema,
      disabledWorkDate: currentOrPastDateSchema,
      maxYearlyEarnings: numberSchema,
      yearEarned: numberSchema,
      occupation: textSchema,
    },
    required: [
      'disabilityDate',
      'lastWorkedDate',
      'disabledWorkDate',
      'maxYearlyEarnings',
      'yearEarned',
      'occupation',
    ],
  },
};
