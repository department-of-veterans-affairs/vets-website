import { personalInformationPage } from 'applications/_mock-form-ae-design-patterns/shared/components/PersonalInformation';

const personalInfo = personalInformationPage();

const personalInfoMax = personalInformationPage({
  key: 'personalInfoPageMax ',
  title: 'Personal information - Max',
  path: 'personal-information-max',
  personalInfoConfig: {
    ssn: true,
    vaFileNumber: true,
    dateOfBirth: true,
    gender: true,
    name: true,
  },
});

const personalInfoMin = personalInformationPage({
  key: 'personalInfoPageMin',
  title: 'Personal information - Min',
  path: 'personal-information-min',
  personalInfoConfig: {
    name: true,
    ssn: true,
    vaFileNumber: false,
    dateOfBirth: false,
    gender: false,
  },
});

const personalInfoCustomErrorMessage = personalInformationPage({
  key: 'personalInfoPageCustomErrorMessage',
  title: 'Personal information - Custom error message',
  path: 'personal-information-custom-error-message',
  personalInfoConfig: {
    ssn: true,
    vaFileNumber: true,
    dateOfBirth: true,
    gender: true,
    name: true,
    errorMessage:
      'We are sorry, but we are unable to process your application without this information. This is a custom error message.',
  },
  dataAdapter: {
    ssnPath: 'veteran.SSNError',
  },
});

const personalInfoError = personalInformationPage({
  key: 'personalInfoPageError',
  title: 'Personal information - Error',
  path: 'personal-information-error',
  personalInfoConfig: {
    ssn: true,
    vaFileNumber: true,
    dateOfBirth: true,
    gender: true,
    name: true,
  },
  dataAdapter: {
    ssnPath: 'veteran.SSNError',
  },
});

export default {
  ...personalInfo,
  ...personalInfoMin,
  ...personalInfoMax,
  ...personalInfoError,
  ...personalInfoCustomErrorMessage,
};
