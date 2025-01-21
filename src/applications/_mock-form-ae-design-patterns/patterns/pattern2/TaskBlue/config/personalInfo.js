import React from 'react';
import PropTypes from 'prop-types';

import { personalInformationPage } from 'applications/_mock-form-ae-design-patterns/shared/components/PersonalInformation';

const CustomErrorMessage = ({ missingFields }) => (
  <div>
    <p>
      Custom error message with missing fields provided as a prop{' '}
      <code>missingFields: string[]</code>
    </p>

    <pre>{JSON.stringify({ missingFields }, null, 2)}</pre>
  </div>
);

CustomErrorMessage.propTypes = {
  missingFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

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
  },
  dataAdapter: {
    ssnPath: 'veteran.SSNError',
  },
  errorMessage:
    'We are sorry, but we are unable to process your application without this information. This is a custom error message as a string.',
});

const personalInfoCustomErrorMessageComponent = personalInformationPage({
  key: 'personalInfoPageCustomErrorMessageComponent',
  title: 'Personal information - Custom error message component',
  path: 'personal-information-custom-error-message-component',
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
  errorMessage: props => <CustomErrorMessage {...props} />,
});

export default {
  ...personalInfo,
  ...personalInfoMin,
  ...personalInfoMax,
  ...personalInfoError,
  ...personalInfoCustomErrorMessage,
  ...personalInfoCustomErrorMessageComponent,
};
