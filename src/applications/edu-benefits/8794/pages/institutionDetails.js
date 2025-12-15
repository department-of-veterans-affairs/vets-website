import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const updateFormData = (oldData, formData) => {
  const prev = oldData?.institutionDetails?.hasVaFacilityCode;
  const curr = formData?.institutionDetails?.hasVaFacilityCode;

  if (prev !== curr) {
    return {
      ...formData,
      institutionDetails: {
        ...formData.institutionDetails,
        institutionName: null,
        facilityCode: '',
        institutionAddress: {},
      },
    };
  }
  return formData;
};

const uiSchema = {
  institutionDetails: {
    ...titleUI('VA facility code'),

    hasVaFacilityCode: yesNoUI({
      title: 'Has your institution been assigned a VA facility code?',
      labels: { N: 'Not yet' },
      errorMessages: { required: 'Please provide a response' },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    institutionDetails: {
      type: 'object',
      properties: {
        hasVaFacilityCode: yesNoSchema,
      },
      required: ['hasVaFacilityCode'],
    },
  },
};

export { uiSchema, schema, updateFormData };
