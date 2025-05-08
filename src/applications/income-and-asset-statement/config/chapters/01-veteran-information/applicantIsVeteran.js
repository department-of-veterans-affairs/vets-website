import {
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Veteran information',
  path: 'veteran/information/applicant',
  uiSchema: {
    'view:applicantIsVeteran': yesNoUI({
      title: 'Are you the Veteran?',
    }),
  },
  schema: {
    type: 'object',
    required: ['view:applicantIsVeteran'],
    properties: {
      'view:applicantIsVeteran': yesNoSchema,
    },
  },
};
