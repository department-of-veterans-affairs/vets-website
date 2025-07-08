import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

// Define the question options
const TRICK_QUESTION_OPTIONS = {
  YES: 'yes',
  NO: 'no',
  MAYBE: 'maybe',
};

const TRICK_QUESTION_LABELS = {
  [TRICK_QUESTION_OPTIONS.YES]: 'Yes',
  [TRICK_QUESTION_OPTIONS.NO]: 'No',
  [TRICK_QUESTION_OPTIONS.MAYBE]: 'Maybe',
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    trickQuestion: radioUI({
      title: 'Is this a trick question?',
      labels: TRICK_QUESTION_LABELS,
      errorMessages: {
        required: 'Please select an option',
      },
      labelHeaderLevel: '3',
      ifMinimalHeader: {
        labelHeaderLevel: '1',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      trickQuestion: radioSchema(Object.values(TRICK_QUESTION_OPTIONS)),
    },
    required: ['trickQuestion'],
  },
};
