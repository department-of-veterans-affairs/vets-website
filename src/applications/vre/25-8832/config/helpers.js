import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export const isDependent = ({ status }) =>
  ['isSpouse', 'isChild'].includes(status);

export const isVeteran = ({ status }) =>
  ['isVeteran', 'isActiveDuty'].includes(status);

export const generateGender = gender => {
  if (!gender) return '-';
  return gender === 'M' ? 'Male' : 'Female';
};

export const reformatData = ({ data }) => {
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
  } = data;
  // since the back end uses the veteranFullName as metadata, we need to make sure that is filled no matter what workflow the user went through
  const veteranName = isVeteran(data) ? fullName : veteranInformation.fullName;

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
    veteranSocialSecurityNumber: isVeteran(data) ? ssn : veteranInformation.ssn,
    status,
  };
};

export const transform = (formConfig, form) => {
  const formData = transformForSubmit(formConfig, { data: reformatData(form) });

  return JSON.stringify({
    educationCareerCounselingClaim: {
      form: formData,
    },
  });
};
