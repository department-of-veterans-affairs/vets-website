// @ts-check
import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('New school credit approvals'),
    newSchoolGrants12OrMoreCredits: yesNoUI({
      title:
        'If you are attending a new school, did they grant 12 or more credit hours for course(s) taken from the closed/disapproved school?',
      errorMessages: {
        required: 'You must make a selection',
      },
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      newSchoolGrants12OrMoreCredits: yesNoSchema,
    },
    required: ['newSchoolGrants12OrMoreCredits'],
  },
};
