import React from 'react';
import { useSelector } from 'react-redux';

const AdditionalOfficialBenefitStatusTitle = ({ formContext }) => {
  const formState = useSelector(state => state?.form?.data || {});
  const index = formContext.pagePerItemIndex;
  const official = Array.isArray(formState['additional-certifying-official'])
    ? formState['additional-certifying-official'][index]
        ?.additionalOfficialDetails
    : {};

  return (
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
          )}'s VA benefit status`
        : 'VA benefit status'}
    </h3>
  );
};

export default AdditionalOfficialBenefitStatusTitle;
