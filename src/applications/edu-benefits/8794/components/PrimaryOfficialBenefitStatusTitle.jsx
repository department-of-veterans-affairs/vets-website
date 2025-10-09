import React from 'react';
import { useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '../helpers';

const PrimaryOfficialBenefitStatusTitle = () => {
  const formState = useSelector(state => state?.form?.data || {});

  const firstName = formState?.primaryOfficialDetails.fullName.first;
  const lastName = formState?.primaryOfficialDetails.fullName.last;
  return (
    <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
      {firstName && lastName
        ? `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
            lastName,
          )}'s VA benefit status`
        : 'VA benefit status'}
    </h3>
  );
};

export default PrimaryOfficialBenefitStatusTitle;
