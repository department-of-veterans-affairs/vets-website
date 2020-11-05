import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export const isFieldRequired = (formData, requiredProp) => {
  return formData[requiredProp];
};

export const transform = (formConfig, form) => {
  const formData = transformForSubmit(formConfig, form);
  return JSON.stringify({
    veteranReadinessEmploymentClaim: {
      form: formData,
    },
  });
};
