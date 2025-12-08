import React from 'react';
import { useSelector } from 'react-redux';

const YellowRibbonProgramTitle = ({ text, eligibilityChapter }) => {
  const institutionDetails = useSelector(
    state => state.form?.data?.institutionDetails,
  );
  const { isUsaSchool } = institutionDetails || {};

  const agreementType = useSelector(state => state.form?.data?.agreementType);
  const isNewAgreement = agreementType === 'startNewOpenEndedAgreement';

  const title = `${text} ${
    isUsaSchool ? '(U.S. schools)' : '(foreign schools)'
  }`;

  const eligibilityTitle = `${
    isNewAgreement ? 'Provide your Yellow Ribbon Program contributions' : text
  } ${isUsaSchool ? '(U.S. schools)' : '(foreign schools)'}`;

  return (
    <legend className="schemaform-block-title yellow-ribbon-title vads-u-font-size--h3 vads-u-margin-top--0">
      {eligibilityChapter ? eligibilityTitle : title}
    </legend>
  );
};

export default YellowRibbonProgramTitle;
