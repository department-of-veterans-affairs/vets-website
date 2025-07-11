import React from 'react';
import { PersonalInformationReview } from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformationReview';

const CustomPersonalInfoReview = props => (
  <PersonalInformationReview
    {...props}
    config={{
      name: { show: true },
      ssn: { show: true },
      vaFileNumber: { show: true },
      dateOfBirth: { show: false },
    }}
    dataAdapter={{
      ssnPath: 'veteranSsnLastFour',
      vaFileNumberPath: 'vaFileNumberLastFour',
    }}
    title="Personal information"
  />
);

export default CustomPersonalInfoReview;
