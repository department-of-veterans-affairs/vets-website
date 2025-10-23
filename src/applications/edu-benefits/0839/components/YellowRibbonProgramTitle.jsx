import React from 'react';
import { useSelector } from 'react-redux';

const YellowRibbonProgramTitle = () => {
  const institutionDetails = useSelector(
    state => state.form?.data?.institutionDetails,
  );
  const { isUsaSchool } = institutionDetails || {};

  const title = isUsaSchool
    ? 'Tell us about your Yellow Ribbon Program contributions (U.S. schools)'
    : 'Tell us about your Yellow Ribbon Program contributions (foreign schools)';

  return (
    <legend className="schemaform-block-title yellow-ribbon-title vads-u-font-size--h3 vads-u-margin-top--0">
      {title}
    </legend>
  );
};

export default YellowRibbonProgramTitle;
