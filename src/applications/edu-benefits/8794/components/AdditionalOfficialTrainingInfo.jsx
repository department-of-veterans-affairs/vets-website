import React from 'react';
import { useSelector } from 'react-redux';
import {
  certifyingOfficialTrainingInfo,
  capitalizeFirstLetter,
} from '../helpers';

const AdditionalOfficialTrainingInfo = ({ formContext }) => {
  const formState = useSelector(state => state?.form?.data || {});
  const index = formContext.pagePerItemIndex;
  const official = Array.isArray(formState['additional-certifying-official'])
    ? formState['additional-certifying-official'][index]
        ?.additionalOfficialDetails
    : {};
  const firstName = official?.fullName?.first;
  const lastName = official?.fullName?.last;
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

export default AdditionalOfficialTrainingInfo;
