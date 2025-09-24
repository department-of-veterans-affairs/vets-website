import React from 'react';
import { useSelector } from 'react-redux';
import { certifyingOfficialTrainingInfo } from '../helpers';

const PrimaryOfficialTrainingInfo = () => {
  const formState = useSelector(state => state?.form?.data || {});

  return (
    <>
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
        {formState?.primaryOfficialDetails.fullName.first &&
        formState?.primaryOfficialDetails.fullName.last
          ? `${formState?.primaryOfficialDetails.fullName.first} ${
              formState?.primaryOfficialDetails.fullName.last
            }'s Section 305 training`
          : 'Section 305 Training'}
      </h3>
      {certifyingOfficialTrainingInfo}
    </>
  );
};

export default PrimaryOfficialTrainingInfo;
