import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import cloneDeep from 'platform/utilities/data/cloneDeep';

export const isFieldRequired = (formData, requiredProp) => {
  return formData[requiredProp];
};

export const transform = (formConfig, form) => {
  const formCopy = cloneDeep(form);
  delete formCopy.data.privacyAgreementAccepted;
  const formData = transformForSubmit(formConfig, formCopy);
  return JSON.stringify({
    veteranReadinessEmploymentClaim: {
      form: formData,
    },
  });
};
