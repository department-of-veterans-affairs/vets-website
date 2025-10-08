import React from 'react';
import { useSelector } from 'react-redux';
import {
  certifyingOfficialTrainingInfo,
  capitalizeFirstLetter,
} from '../helpers';

const PrimaryOfficialTrainingInfo = () => {
  const formState = useSelector(state => state?.form?.data || {});

  const firstName = formState?.primaryOfficialDetails.fullName.first;
  const lastName = formState?.primaryOfficialDetails.fullName.last;
  return (
    <>
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
        {firstName && lastName
          ? `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
              lastName,
            )}'s Section 305 training`
          : 'Section 305 Training'}
      </h3>
      {certifyingOfficialTrainingInfo}
    </>
  );
};

export default PrimaryOfficialTrainingInfo;
