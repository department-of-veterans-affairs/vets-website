import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import cloneDeep from 'platform/utilities/data/cloneDeep';

export const isDependent = formData => {
  return formData.status === 'isSpouse' || formData.status === 'isChild';
};

export const isVeteran = formData => {
  return formData.status === 'isVeteran' || formData.status === 'isActiveDuty';
};

const reformatData = form => {
  let veteranName = {};
  const {
    claimantAddress,
    claimantEmailAddress,
    claimantPhoneNumber,
    dateOfBirth,
    fullName,
    VAFileNumber,
    veteranInformation,
    ssn,
    status,
  } = form.data;
  // since the back end uses the veteranFullName as metadata, we need to make sure that is filled no matter what workflow the user went through
  if (isVeteran(form.data)) {
    veteranName = fullName;
  } else {
    veteranName = veteranInformation.fullName;
  }

  // Reformat the data to have certain items at the root and others wrapped in objects
  return {
    claimantInformation: {
      fullName,
      ssn,
      dateOfBirth,
      vaFileNumber: VAFileNumber,
      emailAddress: claimantEmailAddress,
      phoneNumber: claimantPhoneNumber,
    },
    claimantAddress,
    veteranFullName: veteranName,
    veteranSocialSecurityNumber: isVeteran(form.data)
      ? ssn
      : veteranInformation.ssn,
    status,
  };
};

export const transform = (formConfig, form) => {
  const formCopy = cloneDeep(form);
  const newArrangement = reformatData(formCopy);
  formCopy.data = newArrangement;
  const formData = transformForSubmit(formConfig, formCopy);
  return JSON.stringify({
    educationCareerCounselingClaim: {
      form: formData,
    },
  });
};
