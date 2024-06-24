import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/information/applicant',
  uiSchema: {
    applicantIsVeteran: yesNoUI({
      title: 'Are you the Veteran?',
    }),
  },
  schema: {
    type: 'object',
    required: ['applicantIsVeteran'],
    properties: {
      applicantIsVeteran: yesNoSchema,
    },
  },
};
