import React from 'react';
import { PersonalInformationReview } from 'platform/forms-system/src/js/components/PersonalInformation/PersonalInformationReview';

const CustomPersonalInfoReview = props => (
  <PersonalInformationReview
    {...props}
    config={{
      name: { show: true },
      ssn: { show: true },
      dateOfBirth: { show: true },
    }}
    dataAdapter={{
      ssnPath: 'veteranSsnLastFour',
      vaFileNumberPath: 'vaFileNumberLastFour',
    }}
    title="Personal information"
  />
);

export default CustomPersonalInfoReview;
