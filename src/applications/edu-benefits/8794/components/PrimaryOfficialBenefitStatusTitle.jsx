import React from 'react';
import { useSelector } from 'react-redux';

const PrimaryOfficialBenefitStatusTitle = () => {
  const formState = useSelector(state => state?.form?.data || {});

  return (
    <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
      {formState?.primaryOfficialDetails.fullName.first &&
      formState?.primaryOfficialDetails.fullName.last
        ? `${formState?.primaryOfficialDetails.fullName.first} ${
            formState?.primaryOfficialDetails.fullName.last
          }'s VA benefit status`
        : 'VA benefit status'}
    </h3>
  );
};

export default PrimaryOfficialBenefitStatusTitle;
