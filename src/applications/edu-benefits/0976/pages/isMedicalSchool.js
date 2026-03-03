// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Medical School Information'),
    isMedicalSchool: yesNoUI({
      title:
        'Institution is listed as a medical school in the World Directory of  Medical Schools published by the World Health Organization.',
      errorMessages: {
        required: 'You must make a selection',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      isMedicalSchool: yesNoSchema,
    },
    required: ['isMedicalSchool'],
  },
};
