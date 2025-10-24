import React from 'react';
import { useSelector } from 'react-redux';

const SpecificContributionAmountDescription = () => {
  const indexfromURl = useSelector(
    state => state.router?.location?.pathname?.split('/')?.[2],
  );
  const index = indexfromURl ? parseInt(indexfromURl, 10) : 0;
  const formData = useSelector(state => state.form?.data);
  const currentItem = formData?.yellowRibbonProgramRequest?.[index];
  const unlimitedIndividuals =
    currentItem?.eligibleIndividualsGroup?.unlimitedIndividuals;
  if (!unlimitedIndividuals) return null;
  return (
    <div>
      <p className="vads-u-margin-top--1 vads-u-color--gray-medium">
        Enter the total annual amount per student, not per term or credit hour.
        Amounts over $99,999 are treated as unlimited by the system.
      </p>
    </div>
  );
};

export default SpecificContributionAmountDescription;
