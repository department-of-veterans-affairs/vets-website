import React from 'react';
import PropTypes from 'prop-types';

import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';

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
    ssn: { show: true, required: true },
    vaFileNumber: { show: true, required: true },
    dateOfBirth: { show: true, required: true },
    sex: { show: true, required: true },
    name: { show: true, required: true },
  },
  note: <p>This is a note</p>,
  footer: <p>This is a footer</p>,
  contentBeforeButtons: <p>This is content before buttons</p>,
  contentAfterButtons: <p>This is content after buttons</p>,
  cardHeader: <p>This is a card header</p>,
  header: <p>This is a header</p>,
});

const personalInfoMin = personalInformationPage({
  key: 'personalInfoPageMin',
  title: 'Personal information - Min',
  path: 'personal-information-min',
  personalInfoConfig: {
    name: { show: true, required: true },
    ssn: { show: true, required: true },
    vaFileNumber: { show: false, required: false },
    dateOfBirth: { show: false, required: false },
    sex: { show: false, required: false },
  },
});

const personalInfoError = personalInformationPage({
  key: 'personalInfoPageError',
  title: 'Personal information - Error',
  path: 'personal-information-error',
  personalInfoConfig: {
    ssn: { show: true, required: true },
    vaFileNumber: { show: true, required: true },
    dateOfBirth: { show: true, required: true },
    sex: { show: true, required: true },
    name: { show: true, required: true },
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
    ssn: { show: true, required: true },
    vaFileNumber: { show: true, required: true },
    dateOfBirth: { show: true, required: true },
    sex: { show: true, required: true },
    name: { show: true, required: true },
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
    ssn: { show: true, required: true },
    vaFileNumber: { show: true, required: true },
    dateOfBirth: { show: true, required: true },
    sex: { show: true, required: true },
    name: { show: true, required: true },
  },
  dataAdapter: {
    ssnPath: 'veteran.SSNError',
  },
  errorMessage: props => <CustomErrorMessage {...props} />,
});

const personalInfoCustom = personalInformationPage({
  key: 'personalInfoCustom',
  title: 'Personal information - Custom',
  path: 'personal-information-custom',
  personalInfoConfig: {
    name: { show: true, required: true },
    ssn: { show: true, required: false },
    vaFileNumber: { show: true, required: false },
    dateOfBirth: { show: true, required: true },
    sex: { show: true, required: false },
  },
});

export default {
  ...personalInfo,
  ...personalInfoMin,
  ...personalInfoMax,
  ...personalInfoError,
  ...personalInfoCustomErrorMessage,
  ...personalInfoCustomErrorMessageComponent,
  ...personalInfoCustom,
};
