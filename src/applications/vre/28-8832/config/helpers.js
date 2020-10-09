import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export const isDependent = formData => {
  return formData.status === 'isSpouse' || formData.status === 'isChild';
};

export const isVeteran = formData => {
  return formData.status === 'isVeteran' || formData.status === 'isActiveDuty';
};

const reformatData = form => {
  return {
    claimantInformation: {
      fullName: {
        first: form?.data?.fullName?.first,
        middle: form?.data?.fullName?.middle,
        last: form?.data?.fullName?.last,
        suffix: form?.data?.fullName?.suffix,
      },
      ssn: form?.data?.ssn,
      dateOfBirth: form?.data?.dateOfBirth,
      vaFileNumber: form?.data?.VAFileNumber,
      emailAddress: form?.data?.claimantEmailAddress,
      phoneNumber: form?.data?.claimantPhoneNumber,
    },
    claimantAddress: form?.data?.claimantAddress,
    veteranFullName: form?.data?.veteranInformation?.fullName,
    veteranSocialSecurityNumber: form?.data?.veteranInformation?.ssn,
    status: form?.data?.status,
  };
};

export const transform = (formConfig, form) => {
  const formCopy = Object.assign(form);
  const newArrangement = reformatData(formCopy);
  formCopy.data = newArrangement;
  const formData = transformForSubmit(formConfig, formCopy);
  return JSON.stringify({
    educationCareerCounselingClaim: {
      form: formData,
    },
  });
};
