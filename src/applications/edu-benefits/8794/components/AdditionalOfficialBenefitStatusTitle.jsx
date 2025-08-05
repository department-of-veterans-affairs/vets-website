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
        ? `${official.fullName.first} ${
            official.fullName.last
          }'s VA benefit status`
        : 'VA benefit status'}
    </h3>
  );
};

export default AdditionalOfficialBenefitStatusTitle;
