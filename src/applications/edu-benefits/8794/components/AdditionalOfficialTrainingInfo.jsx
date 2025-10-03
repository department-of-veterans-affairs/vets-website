import React from 'react';
import { useSelector } from 'react-redux';
import { certifyingOfficialTrainingInfo } from '../helpers';

const AdditionalOfficialTrainingInfo = ({ formContext }) => {
  const formState = useSelector(state => state?.form?.data || {});
  const index = formContext.pagePerItemIndex;
  const official = Array.isArray(formState['additional-certifying-official'])
    ? formState['additional-certifying-official'][index]
        ?.additionalOfficialDetails
    : {};

  return (
    <>
      <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
        {official?.fullName?.first && official?.fullName?.last
          ? `${official.fullName.first
              .charAt(0)
              .toUpperCase()}${official.fullName.first.slice(
              1,
            )} ${official.fullName.last
              .charAt(0)
              .toUpperCase()}${official.fullName.last.slice(
              1,
            )}'s Section 305 training`
          : 'Section 305 Training'}
      </h3>
      {certifyingOfficialTrainingInfo}
    </>
  );
};

export default AdditionalOfficialTrainingInfo;
