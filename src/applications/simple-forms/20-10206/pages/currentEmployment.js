import {
  textUI,
  textSchema,
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

// Define employment status options
const EMPLOYMENT_STATUS = Object.freeze({
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  FREELANCE: 'freelance',
  UNEMPLOYED: 'unemployed',
});

const EMPLOYMENT_STATUS_LABELS = Object.freeze({
  [EMPLOYMENT_STATUS.FULL_TIME]: 'Full time',
  [EMPLOYMENT_STATUS.PART_TIME]: 'Part time',
  [EMPLOYMENT_STATUS.FREELANCE]: 'Freelance',
  [EMPLOYMENT_STATUS.UNEMPLOYED]: 'Unemployed',
});

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Current employment'),
    currentEmployer: textUI({
      title: 'Where do you currently work?',
      hint: 'If unemployed, type "N/A"',
      errorMessages: {
        required: 'Enter your current employer',
      },
    }),
    employmentStatus: radioUI({
      title: 'How would you describe your current work schedule?',
      labels: EMPLOYMENT_STATUS_LABELS,
      errorMessages: {
        required: 'Select your employment status',
      },
      labelHeaderLevel: '4',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      currentEmployer: textSchema,
      employmentStatus: radioSchema(Object.values(EMPLOYMENT_STATUS)),
    },
    required: ['currentEmployer', 'employmentStatus'],
  },
};
