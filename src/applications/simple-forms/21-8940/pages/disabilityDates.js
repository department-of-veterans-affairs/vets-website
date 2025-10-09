// @ts-check
import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Disability dates',
      'Now we’ll ask you to tell us when your disability prevented you from working.',
    ),
    disabilityImpactDate: currentOrPastDateUI({
      title:
        'When did your disability begin to impact your full-time employment?',
      labelHeaderLevel: '2',
      errorMessages: {
        required:
          'Enter the date your disability began to affect your full-time employment',
      },
    }),
    lastFullTimeWorkDate: currentOrPastDateUI({
      title: 'When did you last work full time?',
      labelHeaderLevel: '2',
      errorMessages: {
        required: 'Enter the date you last worked full time',
      },
    }),
    becameTooDisabledToWorkDate: currentOrPastDateUI({
      title: 'When did you become too disabled to work?',
      hint:
        'If you don’t remember the exact date, you can give us an estimate.',
      labelHeaderLevel: '2',
      errorMessages: {
        required: 'Enter the date you became too disabled to work',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      disabilityImpactDate: currentOrPastDateSchema,
      lastFullTimeWorkDate: currentOrPastDateSchema,
      becameTooDisabledToWorkDate: currentOrPastDateSchema,
    },
    required: [
      'disabilityImpactDate',
      'lastFullTimeWorkDate',
      'becameTooDisabledToWorkDate',
    ],
  },
};
