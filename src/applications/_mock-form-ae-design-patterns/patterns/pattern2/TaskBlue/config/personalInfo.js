import { personalInformationPage } from 'applications/_mock-form-ae-design-patterns/shared/components/PersonalInformation';

const personalInfo = personalInformationPage();

const personalInfoMax = personalInformationPage({
  key: 'personalInfoPagePartial',
  title: 'Personal information - Partial',
  path: 'personal-information-partial',
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
    ssn: false,
    name: false,
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
  ...personalInfoCustomErrorMessage,
  ...personalInfoError,
  ...personalInfoMax,
  ...personalInfoMin,
};
