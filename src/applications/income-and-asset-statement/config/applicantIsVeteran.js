import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Applicant information',
  path: 'applicant/information/is-veteran',
  uiSchema: {
    applicantIsVeteran: yesNoUI({
      updateUiSchema: formData => {
        return {
          'ui:title': `Are you ${formData.veteranFullName.first} ${
            formData.veteranFullName.last
          }?`,
        };
      },
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
