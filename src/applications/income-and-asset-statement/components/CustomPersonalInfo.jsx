import React from 'react';
import {
  PersonalInformation,
  PersonalInformationHeader,
} from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformation';

const CustomPersonalInfo = props => (
  <PersonalInformation
    {...props}
    config={{
      name: { show: true, required: true },
      ssn: { show: true, required: true },
      vaFileNumber: { show: true, required: false },
      dateOfBirth: { show: false },
    }}
    dataAdapter={{
      ssnPath: 'veteranSocialSecurityNumber',
      vaFileNumberPath: 'vaFileNumber',
    }}
  >
    <PersonalInformationHeader>
      <h1 className="vads-u-margin-bottom--3 vads-u-font-size--h2">
        Confirm the personal information we have on file for you
      </h1>
    </PersonalInformationHeader>
  </PersonalInformation>
);

export default CustomPersonalInfo;
