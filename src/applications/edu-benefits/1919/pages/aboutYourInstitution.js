import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const updateFormData = (oldData, formData) => {
  const prev = oldData?.aboutYourInstitution;
  const curr = formData?.aboutYourInstitution;

  if (prev !== curr) {
    return {
      ...formData,
      institutionDetails: {
        ...formData.institutionDetails,
        facilityCode: '',
        institutionName: '',
        institutionAddress: {},
      },
    };
  }
  return formData;
};

const uiSchema = {
  ...titleUI('Tell us about your institution'),
  aboutYourInstitution: {
    ...yesNoUI({
      title: 'Has your institution been assigned a facility code?',
      errorMessages: {
        required: 'Please provide a response',
      },
      labels: {
        Y: 'Yes',
        N: 'Not yet',
      },
    }),
  },
};

const schema = {
  type: 'object',
  required: ['aboutYourInstitution'],
  properties: {
    aboutYourInstitution: yesNoSchema,
  },
};

export { schema, uiSchema, updateFormData };
